using System.ComponentModel.DataAnnotations;

namespace Covid.DAL.Attributes
{
    public class HebrewIdAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            var numOfTeudatZehut = value?.ToString();
            int sumAll = 0;
            if (numOfTeudatZehut == null)
                return false;

            if (numOfTeudatZehut.Length > 9 || string.IsNullOrEmpty(numOfTeudatZehut))
                return false;

            else if (numOfTeudatZehut.Length < 9)
            {
                while (numOfTeudatZehut.Length < 9)
                {
                    numOfTeudatZehut = "0" + numOfTeudatZehut;
                }
            }

            for (int i = 9; i > 0; i--)
            {
                int x = Convert.ToInt32(numOfTeudatZehut.Substring(i - 1, 1));
                if (i % 2 == 0)
                {
                    x *= 2;
                    if (x > 9)
                        x = (x % 10) + 1;
                    sumAll += x;
                }
                else
                {
                    x *= 1;
                    sumAll += x;
                }
            }
            sumAll %= 10;
            if (sumAll % 10 > 0)
                return false;
            else
                return true;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Id is not valid";
        }
    }
}
