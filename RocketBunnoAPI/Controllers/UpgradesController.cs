using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using RocketBunnoAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class UpgradesController : ControllerBase
{
    private readonly AppDbContext _context;

    public UpgradesController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/upgrades
    [HttpPost]
    public async Task<IActionResult> CreateUpgrade([FromBody] Upgrade upgrade)
    {
        _context.Upgrades.Add(upgrade);
        await _context.SaveChangesAsync();
        return Ok(upgrade);
    }

    // GET api/upgrades
    [HttpGet]
    public async Task<IActionResult> GetAllUpgrades()
    {
        var upgrades = await _context.Upgrades
            .Include(u => u.User)  // Ovo će uključiti korisnika koji je napravio upgrade
            .ToListAsync();
        return Ok(upgrades);
    }

    // GET api/upgrades/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUpgradeById(int id)
    {
        var upgrade = await _context.Upgrades
            .Include(u => u.User)  // Ovo će uključiti korisnika koji je napravio upgrade
            .FirstOrDefaultAsync(u => u.Id == id);

        if (upgrade == null)
            return NotFound();

        return Ok(upgrade);
    }

    // PUT api/upgrades/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUpgrade(int id, [FromBody] Upgrade updatedUpgrade)
    {
        var upgrade = await _context.Upgrades.FindAsync(id);
        if (upgrade == null)
            return NotFound();

        upgrade.Name = updatedUpgrade.Name;
        upgrade.Level = updatedUpgrade.Level;

        await _context.SaveChangesAsync();
        return Ok(upgrade);
    }

    // DELETE api/upgrades/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUpgrade(int id)
    {
        var upgrade = await _context.Upgrades.FindAsync(id);
        if (upgrade == null)
            return NotFound();

        _context.Upgrades.Remove(upgrade);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
