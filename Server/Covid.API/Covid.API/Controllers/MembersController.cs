

using Covid.DAL;
using Covid.DAL.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Covid.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("corsapp")]
    public class MembersController : ControllerBase
    {
        [HttpGet]
        [Route("all")]
        public async Task<List<MemberModel>> GetMembers()
        {
            var db = new DbAccess();
            return await db.GetAllMembers();
        }

        [HttpGet]
        [Route("unvaccinated")]
        public async Task<long> GetUnvacciatedMembers()
        {
            var db = new DbAccess();
            return await db.GetUnvaccinatedMembers();
        }

        [HttpGet]
        [Route("sickForMonth")]
        public async Task<List<SickMembersDto>> GetSickMembersForMonth()
        {
            var db = new DbAccess();
            var allMembers = await db.GetAllMembers();
            var data = new Dictionary<DateTime, int>();
            var result = new List<SickMembersDto>();
            var startDate = DateTime.Now.AddMonths(-1);
            var endDate = DateTime.Now;

            //Initilaize dictionary with dates of last month
            for (var day = startDate.Date; day.Date <= endDate.Date; day = day.AddDays(1))
            {
                data.Add(day, 0);
            }

            foreach (var member in allMembers)
            {
                //Continue if member wasn't sick in last month
                if (!member.PositiveResultDate.HasValue ||
                    member.RecoveryDate < startDate)
                    continue;
                var startDateOfMember = startDate > member.PositiveResultDate ? startDate : member.PositiveResultDate.Value;
                var endDateOfMember = member.RecoveryDate ?? endDate;
                for (var day = startDateOfMember.Date; day.Date <= endDateOfMember.Date; day = day.AddDays(1))
                {
                    data[day]++;
                }
            }
            foreach (var record in data)
            {
                result.Add(new SickMembersDto(record.Key, record.Value));
            }
            return result;
        }

        [HttpGet]
        [Route("get/{id}")]
        public async Task<ActionResult<MemberModel>> GetMember(string id)
        {
            var db = new DbAccess();
            if (!await db.MemberExists(id))
                return NotFound();
            return await db.GetMember(id);
        }

        [HttpPost]
        [Route("new")]
        public async Task<IActionResult> NewMember([FromBody] MemberModel member)
        {
            if (ModelState.IsValid)
            {
                var db = new DbAccess();
                if (await db.MemberExists(member?.Id))
                {
                    return StatusCode(StatusCodes.Status409Conflict);
                }
                await db.CreateMember(member);
                return Ok();
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateMember([FromBody] MemberModel member)
        {
            if (ModelState.IsValid)
            {
                var db = new DbAccess();

                if (!await db.MemberExists(member?.Id))
                {
                    return NotFound();
                }

                await db.UpdateMember(member);
                return Ok();
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteMember(string id)
        {
            var db = new DbAccess();
            if (await db.MemberExists(id))
            {

                await db.DeleteMember(id);
                return Ok();
            }
            return NotFound();
        }

        [HttpPut]
        [Route("addVaccine/{id}")]
        public async Task<IActionResult> AddVaccineToMember(string id, [FromBody] VaccinationModel vaccination)
        {
            if (ModelState.IsValid)
            {
                var db = new DbAccess();
                if (!await db.MemberExists(id))
                {
                    return NotFound();
                }
                var member = await db.GetMember(id);
                if (member.Vaccinations.Count == 4)
                {
                    return BadRequest("Cannot add more then 4 vaccinations");
                }
                await db.AddVaccine(id, vaccination);
                return Ok();
            }
            return StatusCode(StatusCodes.Status400BadRequest);
        }
    }
}
