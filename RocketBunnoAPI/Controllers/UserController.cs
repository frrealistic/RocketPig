using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using RocketBunnoAPI.Models;

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
}
