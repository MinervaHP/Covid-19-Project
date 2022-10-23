using Covid.DAL.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Covid.DAL
{
    public class DbAccess
    {
        private const string connectionString = "mongodb://127.0.0.1:27017";
        private const string databaseName = "Covid-19DB";
        private const string memberCollection = "member";
        private static IMongoCollection<T> ConnectToMongo<T>(in string collection)
        {
            var client = new MongoClient(connectionString);
            var db = client.GetDatabase(databaseName);
            return db.GetCollection<T>(collection);
        }

        public async Task<bool> MemberExists(string id)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            return await MemberCollection.Find(_ => _.Id == id).AnyAsync();
        }

        public async Task<MemberModel> GetMember(string id)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            return await MemberCollection.Find(u => u.Id == id).SingleOrDefaultAsync();
        }

        public async Task<List<MemberModel>> GetAllMembers()
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            var results = await MemberCollection.FindAsync(_ => true);
            return results.ToList();

        }
        public Task CreateMember(MemberModel member)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            return MemberCollection.InsertOneAsync(member);
        }
        public Task UpdateMember(MemberModel member)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            var filter = Builders<MemberModel>.Filter.Eq(field: "Id", member.Id);
            return MemberCollection.ReplaceOneAsync(filter, member, options: new ReplaceOptions { IsUpsert = true });
        }

        public Task DeleteMember(string id)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            return MemberCollection.DeleteOneAsync(m => m.Id == id);
        }
        public Task AddVaccine(string id,VaccinationModel v)
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            var filter = Builders<MemberModel>.Filter.Eq(field: "Id", id);
            var update = Builders<MemberModel>.Update.Push(u => u.Vaccinations, new VaccinationModel() { VaccinationDate = v.VaccinationDate , Manufacturer = v.Manufacturer });
            return MemberCollection.FindOneAndUpdateAsync(filter, update);
        }
        public Task<long> GetUnvaccinatedMembers()
        {
            var MemberCollection = ConnectToMongo<MemberModel>(memberCollection);
            var filter = Builders<MemberModel>.Filter.Size("Vaccinations", 0);
            return MemberCollection.CountDocumentsAsync(filter);
        }


    }
}
