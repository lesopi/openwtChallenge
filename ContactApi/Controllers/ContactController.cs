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
    [Route("api/Contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ContactContext _context;

        public ContactController(ContactContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Return the list of all contacts.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContact()
        {
            return await _context.Contact.ToListAsync();
        }

        /// <summary>
        /// Return the contact corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(long id)
        {
            var contact = await _context.Contact.FindAsync(id);
            //var test = await _context.Contact.Where
            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        /// <summary>
        /// Modify the contact corresponding to id.
        /// </summary>
        /// <param name="id"></param>
        ///<param name="contact"></param>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(long id, Contact contact)
        {
            if (id != contact.id)
            {
                
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
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
        /// Create a new contact.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            _context.Contact.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.id }, contact);
        }

        /// <summary>
        /// Delete the contact corresponding to id.
        /// </summary>
        /// <remark>
        /// You must also request DELETE: api/ContactAndSkill/deleteContact/{id} 
        /// to ensure that there are no unexisting ids in this table
        ///</remark>
        /// <param name="id"></param>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Contact>> DeleteContact(long id)
        {
            var contact = await _context.Contact.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contact.Remove(contact);
            await _context.SaveChangesAsync();

            return contact;
        }

        private bool ContactExists(long id)
        {
            return _context.Contact.Any(e => e.id == id);
        }
    }
}
