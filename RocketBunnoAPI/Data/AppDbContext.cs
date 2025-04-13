using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Models;

namespace RocketBunnoAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<User> Users {get; set;}
    public DbSet<Score> Scores {get; set;}
    public DbSet<Upgrade> Upgrades {get; set;}
}