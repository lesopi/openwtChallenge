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
    public class ContactAndSkillController : ControllerBase
    {
        private readonly ContactAndSkillContext _context;

        public ContactAndSkillController(ContactAndSkillContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Return the list of all contact and skill links.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactAndSkill>>> GetContactAnsSkillTable()
        {
            return await _context.ContactAnsSkillTable.ToListAsync();
        }

        /// <summary>
        /// Return the contact and skill link corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactAndSkill>> GetContactAndSkill(long id)
        {
            var contactAndSkill = await _context.ContactAnsSkillTable.FindAsync(id);

            if (contactAndSkill == null)
            {
                return NotFound();
            }

            return contactAndSkill;
        }


        /// <summary>
        /// Return the contact and skill link where the contact id corresponds to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("fromContact/{id}")]
        public async Task<ActionResult<ContactAndSkill>> GetContactAndSkillFromContact(long id)
        {
            var result =  await _context.ContactAnsSkillTable.Where(p => p.contactId == id).ToListAsync();

            if (!result.Any())
            return NoContent();

            return Ok(result);
        }

        /// <summary>
        /// Return the contact and skill link where the skill id corresponds to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("fromSkill/{id}")]
        public async Task<ActionResult<ContactAndSkill>> GetContactAndSkillFromSkill(long id)
        {
            var result =  await _context.ContactAnsSkillTable.Where(p => p.skillId == id).ToListAsync();

            if (!result.Any())
            return NoContent();

            return Ok(result);
        }

        /// <summary>
        /// Update the contact and skill link corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="contactAndSkill"></param>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactAndSkill(long id, ContactAndSkill contactAndSkill)
        {
            if (id != contactAndSkill.id)
            {
                return BadRequest();
            }

            var result = await _context.ContactAnsSkillTable.Where(
                p => p.skillId == contactAndSkill.skillId 
                && p.contactId == contactAndSkill.contactId).ToListAsync();
            if(result.Count == 0) {
                _context.Entry(contactAndSkill).State = EntityState.Modified;
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactAndSkillExists(id))
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
        /// Create a new contact and skill link.
        /// </summary>
        /// <param name="contactAndSkill"></param>
        [HttpPost]
        public async Task<ActionResult<ContactAndSkill>> PostContactAndSkill(ContactAndSkill contactAndSkill)
        {
            var result = await _context.ContactAnsSkillTable.Where(
                p => p.skillId == contactAndSkill.skillId 
                && p.contactId == contactAndSkill.contactId).ToListAsync();
            if(result.Count == 0) {
                _context.ContactAnsSkillTable.Add(contactAndSkill);
                await _context.SaveChangesAsync();
                

                return CreatedAtAction("GetContactAndSkill", new { id = contactAndSkill.id }, contactAndSkill);
            } else {
                return BadRequest();
            }
        }


        /// <summary>
        /// Delete all the contact and skill links where the id appears as a contact.
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("deleteContact/{id}")]
        public async Task<ActionResult<ContactAndSkill>> DeleteContactAndSkillDeleteContact(long id)
        {
            var result = await _context.ContactAnsSkillTable.Where(p => 
            p.contactId == id).ToListAsync();
            if (result == null)
            {
                return NoContent();
            } else {
                foreach (var row in result) {
                    _context.ContactAnsSkillTable.Remove(row);
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Delete all the contact and skill links where the id appears as a skill.
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("deleteSkill/{id}")]
        public async Task<ActionResult<ContactAndSkill>> DeleteContactAndSkillDeleteSkill(long id)
        {
            var result = await _context.ContactAnsSkillTable.Where(p => 
            p.skillId == id).ToListAsync();
            if (result == null)
            {
                return NoContent();
            } else {
                foreach (var row in result) {
                    _context.ContactAnsSkillTable.Remove(row);
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Delete the  contact and skill link corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ContactAndSkill>> DeleteContactAndSkill(long id)
        {
            var contactAndSkill = await _context.ContactAnsSkillTable.FindAsync(id);
            if (contactAndSkill == null)
            {
                return NotFound();
            }

            _context.ContactAnsSkillTable.Remove(contactAndSkill);
            await _context.SaveChangesAsync();

            return contactAndSkill;
        }

        private bool ContactAndSkillExists(long id)
        {
            return _context.ContactAnsSkillTable.Any(e => e.id == id);
        }
    }
}
