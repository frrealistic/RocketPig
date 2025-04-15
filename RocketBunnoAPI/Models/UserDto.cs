using RocketBunnoAPI.Models;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public List<Score> Scores { get; set; }
    public List<Upgrade> Upgrades { get; set; }
}

