using System.Text.Json.Serialization;

namespace Covid.API.Controllers
{
    public class SickMembersDto
    {
        public string Name { get; set; }
        [JsonPropertyName("sick members")]
        public int CountOfMembers { get; set; }

        public SickMembersDto(DateTime name, int count)
        {
            Name = name.ToString("dd-MM");
            CountOfMembers = count;
        }
    }
}