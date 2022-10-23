using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Covid.DAL.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Covid.DAL.Models
{
    public class MemberModel
    {
        [BsonId]
        [Required]
        [HebrewId]
        public string? Id { get; set; }
        [Required]
        [MinLength(2)]
        public string? FirstName { get; set; }
        [Required]
        [MinLength(2)]
        public string? LastName { get; set; }

        public string? Address { get; set; }
        [Required]
        [DataType(DataType.Date)]
        [DateSmallerThanToday]
        public string? DateOfBirth { get; set; }
        [Required]
        [RegularExpression(@"^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$")]
        public string? PhoneNumber { get; set; }
        [Required]
        [RegularExpression(@"^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$")]
        public string? CellPhoneNumber { get; set; }
        public List<VaccinationModel> Vaccinations { get; set; } = new List<VaccinationModel>();
        public DateTime? PositiveResultDate { get; set; }
        public DateTime? RecoveryDate { get; set; }





    }
}
