namespace RocketBunnoAPI.Models;
using System.Text.Json.Serialization;

public class Score
{
    public int Id { get; set; }
    public int Distance { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    [JsonIgnore]
    public User? User { get; set; }  // User je nullable jer može biti null
}
