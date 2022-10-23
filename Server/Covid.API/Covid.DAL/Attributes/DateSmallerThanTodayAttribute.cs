using System.ComponentModel.DataAnnotations;

namespace Covid.DAL.Attributes
{
    public class DateSmallerThanTodayAttribute : ValidationAttribute
    {
      
        public override bool IsValid(object? value)
        {
            if (value == null)
                return false;
            DateTime dt = DateTime.Parse(value?.ToString());
            return dt <= DateTime.Now;
        }
    }
}
