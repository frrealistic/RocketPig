using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using RocketBunnoAPI.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

using System.Text;


[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/users
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // GET api/users
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Include(u => u.Scores)
            .Include(u => u.Upgrades)
            .ToListAsync();
        return Ok(users);
    }

    // GET api/users/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users
            .Include(u => u.Scores)
            .Include(u => u.Upgrades)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // PUT api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        user.Username = updatedUser.Username;
        // Ako imaš još fieldova, ažuriraj ih ovdje

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // DELETE api/users/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    // POST api/users/register
[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user)
{
    if (_context.Users.Any(u => u.Username == user.Username))
        return BadRequest("Username already taken.");

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return Ok("User registered.");
}

// POST api/users/login
[HttpPost("login")]
public IActionResult Login([FromBody] User user)
{
    var existingUser = _context.Users.FirstOrDefault(u =>
        u.Username == user.Username && u.Password == user.Password);

    if (existingUser == null)
        return Unauthorized("Invalid credentials.");

    var token = GenerateJwtToken(existingUser);
    return Ok(new { token });
}

// Metoda za generiranje tokena
private string GenerateJwtToken(User user)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super_secret_key_123!"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username)
    };

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

}
