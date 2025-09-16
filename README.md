# Loan API

## Local Deployment

1. Rename `example.env` to `.env`
2. Run `docker-compose up -d`

## Testing

1. Run `npm install`
2. Run `npm run test`


## About the project
The nest.js app is split into services
- Loans service, that gets, processes and creates loans
- Crime grade service that commmunicates with the AI agent.
For the AI agent I used cloud-hosted flowise and as the scraper - trial FireCrawl account, due to crimegrade.org having cloudflare bot protection. If I had time - I would implement a stealth headless browser like puppeteer to do the scraping.