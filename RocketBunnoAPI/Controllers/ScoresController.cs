using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using RocketBunnoAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class ScoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ScoresController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/scores
    [HttpPost]
    public async Task<IActionResult> CreateScore([FromBody] Score score)
    {
        _context.Scores.Add(score);
        await _context.SaveChangesAsync();
        return Ok(score);
    }

    // GET api/scores
    [HttpGet]
    public async Task<IActionResult> GetAllScores()
    {
        var scores = await _context.Scores
            .Include(s => s.User)  // Ovo će uključiti korisnika koji je napravio score
            .ToListAsync();
        return Ok(scores);
    }

    // GET api/scores/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetScoreById(int id)
    {
        var score = await _context.Scores
            .Include(s => s.User)  // Ovo će uključiti korisnika koji je napravio score
            .FirstOrDefaultAsync(s => s.Id == id);

        if (score == null)
            return NotFound();

        return Ok(score);
    }

    // PUT api/scores/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateScore(int id, [FromBody] Score updatedScore)
    {
        var score = await _context.Scores.FindAsync(id);
        if (score == null)
            return NotFound();

        score.Distance = updatedScore.Distance;
        score.Date = updatedScore.Date;

        await _context.SaveChangesAsync();
        return Ok(score);
    }

    // DELETE api/scores/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteScore(int id)
    {
        var score = await _context.Scores.FindAsync(id);
        if (score == null)
            return NotFound();

        _context.Scores.Remove(score);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
