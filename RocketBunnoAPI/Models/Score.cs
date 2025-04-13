namespace RocketBunnoAPI.Models;

public class Score
{
    public int Id { get; set; }
    public int Distance { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; }
}