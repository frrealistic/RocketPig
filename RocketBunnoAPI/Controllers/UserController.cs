using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using RocketBunnoAPI.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    // U konstruktoru injektiraj IConfiguration
    public UsersController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;  // Injektiraj _config
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
        var user = await _context.Users
            .Include(u => u.Scores)
            .Include(u => u.Upgrades)
            .FirstOrDefaultAsync(u => u.Id == id);

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
        // Normaliziraj korisničko ime (pretvori ga u mala slova)
        user.Username = user.Username.ToLower();

        // Provjeri da li korisničko ime već postoji u bazi
        if (_context.Users.Any(u => u.Username == user.Username))
            return BadRequest("Username already taken.");

        // Hashiraj lozinku prije nego je pohraniš
        var passwordHasher = new PasswordHasher<User>();
        user.Password = passwordHasher.HashPassword(user, user.Password);  

        // Dodaj korisnika u bazu
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok("User registered.");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User user)
    {
        // Normaliziraj korisničko ime (pretvori u mala slova)
        user.Username = user.Username.ToLower();

        var existingUser = _context.Users.FirstOrDefault(u =>
            u.Username == user.Username);

        if (existingUser == null)
            return Unauthorized("Invalid credentials.");

        // Provjera lozinke: koristi PasswordHasher za usporedbu
        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(existingUser, existingUser.Password, user.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials.");

        var token = GenerateJwtToken(existingUser);
        return Ok(new { token });
    }

    // Metoda za generiranje tokena
private string GenerateJwtToken(User user)
{
    var keyString = _config["Jwt:Key"];
    if (string.IsNullOrEmpty(keyString))
    {
        throw new ArgumentNullException("JWT key is not configured properly.");
    }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
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
