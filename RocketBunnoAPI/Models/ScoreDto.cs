namespace RocketBunnoAPI.DTOs
{
    public class ScoreDto
    {
        public int Id { get; set; }
        public int Distance { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
    }

    public class CreateScoreDto
    {
        public int Distance { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
    }
}