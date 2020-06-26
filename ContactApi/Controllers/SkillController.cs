using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactApi.Models;

namespace ContactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly SkillContext _context;

        public SkillController(SkillContext context)
        {
            _context = context;
        }

        
        /// <summary>
        /// Return the list of all skills.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Skill>>> GetSkills()
        {
            return await _context.Skills.ToListAsync();
        }

        /// <summary>
        /// Return the skill corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("{id}")]
        public async Task<ActionResult<Skill>> GetSkill(long id)
        {
            var skill = await _context.Skills.FindAsync(id);

            if (skill == null)
            {
                return NotFound();
            }

            return skill;
        }

        /// <summary>
        /// Modify the skill corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="skill"></param>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSkill(long id, Skill skill)
        {
            if (id != skill.id)
            {
                return BadRequest();
            }

            _context.Entry(skill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SkillExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Create a new skill.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Skill>> PostSkill(Skill skill)
        {
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSkill", new { id = skill.id }, skill);
        }

        /// <summary>
        /// Delete the skill corresponding to id.
        /// </summary>
        /// <remark>
        /// You must also request DELETE: api/ContactAndSkill/deleteSkill/{id} 
        /// to ensure that there are no unexisting ids in this table
        ///</remark>
        /// <param name="id"></param>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Skill>> DeleteSkill(long id)
        {
            var skill = await _context.Skills.FindAsync(id);
            if (skill == null)
            {
                return NotFound();
            }

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();

            return skill;
        }

        private bool SkillExists(long id)
        {
            return _context.Skills.Any(e => e.id == id);
        }
    }
}
