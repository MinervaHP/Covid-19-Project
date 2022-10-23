using Covid.DAL.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using static Covid.DAL.Models.MemberModel;

namespace Covid.DAL.Models
{
    public class VaccinationModel
    {
        [Required]
        [DataType(DataType.Date)]
        [DateSmallerThanToday]
        public DateTime VaccinationDate { get; set; }
        [EnumDataType(typeof(VaccineManufacturer))]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VaccineManufacturer Manufacturer { get; set; }
    }

    public enum VaccineManufacturer
    {
        Moderna,
        Pfizer,
        AstraZeneca,
        Novavax,
        Sputnik,
        JohnsonAndJohnson,
        SerumInstituteOfIndia,
        Sinopharm,
        Sinawak,
        BharatBiotech
    }
}