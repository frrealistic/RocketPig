namespace RocketBunnoAPI.Models;

public class User
{
    public int Id {get; set;}
    public string Username {get; set;} = string.Empty;
    public ICollection<Score> Scores { get; set; } = new List<Score>();
    public ICollection<Upgrade> Upgrades { get; set; } = new List<Upgrade>();

}