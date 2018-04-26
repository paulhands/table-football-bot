﻿using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Models
{
    public class MatchContext
    {
        private readonly IMongoDatabase _database;

        public MatchContext(IOptions<Settings> settings)
        {
            MongoUrl address = new MongoUrl("mongodb://ds011462.mlab.com:11462");
            MongoClientSettings fromUrl = MongoDB.Driver.MongoClientSettings.FromUrl(address);
            MongoCredential credential = MongoCredential.CreateCredential(settings.Value.Database, "admin", "2604aj1010rb");
            fromUrl.Credential = credential;

            MongoClient client = new MongoClient(fromUrl);
            if (client != null)
            {
                _database = client.GetDatabase(settings.Value.Database);
            }
        }

        public IMongoCollection<Match> Matches
        {
            get
            {
                return _database.GetCollection<Match>("matches");
            }
        }
    }
}