namespace RocketBunnoAPI.Models;

public class Upgrade
{
    public int Id {get; set;}
    public string Name {get; set;} = string.Empty;
    public int Level {get; set;}

    public int UserId {get; set;}
    public User User {get; set;}
}