using Microsoft.EntityFrameworkCore;

namespace ContactApi.Models {
    public class ContactAndSkillContext : DbContext {
        public ContactAndSkillContext(DbContextOptions<ContactAndSkillContext> options) 
            : base(options) {}

        public DbSet<ContactAndSkill> ContactAnsSkillTable {get; set;}
    }
}