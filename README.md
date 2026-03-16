# NetShort API Scraper

Automated scraper module for NetShort API with encrypted request/response handling.

## 📦 Installation

```bash
npm install axios
```

## 🚀 Usage

### CLI Mode

```bash
# Run all scrapers
node scraper.js

# Run specific scraper
node scraper.js dashboard
node scraper.js detail [shortPlayId]
node scraper.js search [keyword] [page]

# Examples
node scraper.js all 2027266000629530625 funny
node scraper.js detail 2027266000629530625
node scraper.js search comedy 1
```

### Module Mode (Require in other scripts)

```javascript
const scraper = require('./scraper');

// Single scraper
const dashboard = await scraper.scrapeDashboard();
const detail = await scraper.scrapeDetailInfo({ shortPlayId: '2027266000629530625' });
const search = await scraper.scrapeSearch({ searchCode: 'ceo', pageNo: '1' });

// Run all scrapers
const results = await scraper.scrapeAll({
    detailParams: { shortPlayId: '2027266000629530625' },
    searchParams: { searchCode: 'comedy', pageNo: '1', pageSize: '20' }
});

// Skip specific scrapers
const results = await scraper.scrapeAll({
    skipDashboard: true,
    detailParams: { shortPlayId: '123456' }
});
```

## 📖 API Reference

### `scrapeDashboard()`
Scrape dashboard/tab data.
```javascript
const result = await scraper.scrapeDashboard();
```

### `scrapeDetailInfo(params)`
Get video detail information.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| shortPlayId | string | `2027266000629530625` | Video ID |
| codec | string | `h265` | Video codec (h265/h264) |
| playClarity | string | `1080p` | Video quality |

```javascript
const detail = await scraper.scrapeDetailInfo({
    shortPlayId: '2027266000629530625',
    codec: 'h264',
    playClarity: '720p'
});
```

### `scrapeSearch(params)`
Search videos by keyword.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| searchCode | string | `ceo` | Search keyword |
| pageNo | string | `1` | Page number |
| pageSize | string | `20` | Results per page |
| searchFlag | string | `1` | Search flag |

```javascript
const results = await scraper.scrapeSearch({
    searchCode: 'comedy',
    pageNo: '1',
    pageSize: '50'
});
```

### `scrapeAll(options)`
Run all scrapers at once.

```javascript
const results = await scraper.scrapeAll({
    skipDashboard: false,
    skipDetail: false,
    skipSearch: false,
    detailParams: { shortPlayId: '123456' },
    searchParams: { searchCode: 'trending', pageNo: '1' }
});
```

## 📁 Example: Custom Script

Create `my-scraper.js`:

```javascript
const scraper = require('./scraper');

async function main() {
    console.log('Starting custom scraper...');
    
    // Search for videos
    const searchResults = await scraper.scrapeSearch({
        searchCode: 'action',
        pageNo: '1'
    });
    
    // Get details from first result
    if (searchResults && searchResults.data) {
        const firstVideo = searchResults.data[0];
        const detail = await scraper.scrapeDetailInfo({
            shortPlayId: firstVideo.shortPlayId
        });
        console.log('Video details:', detail);
    }
}

main();
```

Run:
```bash
node my-scraper.js
```

## 🔧 Configuration

Edit `scraper.js` to change:
- `PUBLIC_KEY` / `PRIVATE_KEY` - RSA keys
- Authorization bearer token in headers
- Device code
- API version

## ⚠️ Disclaimer

This tool is for educational purposes only. Use responsibly and respect the API terms of service.
