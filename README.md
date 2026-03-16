# NetShort API Scraper

Automated scraper module for NetShort API dengan 3 endpoints: **Dashboard**, **Detail Info**, dan **Search**.

## 📦 Installation

```bash
npm install axios
```

## 🚀 Usage

### CLI Mode

```bash
# Run semua scrapers (dashboard + detail + search)
node scraper.js

# Run specific scraper
node scraper.js dashboard
node scraper.js detail [shortPlayId]
node scraper.js search [keyword] [page]

# Examples
node scraper.js all 2027266000629530625 funny
node scraper.js dashboard
node scraper.js detail 2027266000629530625
node scraper.js search comedy 1
```

### Module Mode (Require in other scripts)

```javascript
const scraper = require('./scraper');

// === SINGLE SCRAPER ===

// Dashboard
const dashboard = await scraper.scrapeDashboard();

// Detail Info
const detail = await scraper.scrapeDetailInfo({ 
    shortPlayId: '2027266000629530625',
    codec: 'h265',
    playClarity: '1080p'
});

// Search
const search = await scraper.scrapeSearch({ 
    searchCode: 'ceo', 
    pageNo: '1',
    pageSize: '20'
});

// === RUN ALL SCRAPERS ===
const results = await scraper.scrapeAll({
    detailParams: { shortPlayId: '2027266000629530625' },
    searchParams: { searchCode: 'comedy', pageNo: '1' }
});

// Skip specific scrapers
const results = await scraper.scrapeAll({
    skipDashboard: true,
    skipSearch: true,
    detailParams: { shortPlayId: '123456' }
});

// Silent mode (no logs)
const results = await scraper.scrapeAll({ log: false });
```

## 📖 API Reference

### `scrapeDashboard(log = true)`
Scrape dashboard/tab data.

**Returns:** `Promise<Object|null>`

```javascript
const result = await scraper.scrapeDashboard();
```

### `scrapeDetailInfo(params = {}, log = true)`
Get video detail information.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| params.shortPlayId | string | `2027266000629530625` | Video ID |
| params.codec | string | `h265` | Video codec (h265/h264) |
| params.playClarity | string | `1080p` | Video quality |
| log | boolean | `true` | Show console logs |

**Returns:** `Promise<Object|null>`

```javascript
const detail = await scraper.scrapeDetailInfo({
    shortPlayId: '2027266000629530625',
    codec: 'h264',
    playClarity: '720p'
});
```

### `scrapeSearch(params = {}, log = true)`
Search videos by keyword.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| params.searchCode | string | `ceo` | Search keyword |
| params.pageNo | string | `1` | Page number |
| params.pageSize | string | `20` | Results per page |
| params.searchFlag | string | `1` | Search flag |
| log | boolean | `true` | Show console logs |

**Returns:** `Promise<Object|null>`

```javascript
const results = await scraper.scrapeSearch({
    searchCode: 'comedy',
    pageNo: '1',
    pageSize: '50'
});
```

### `scrapeAll(options = {})`
Run all scrapers at once.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| skipDashboard | boolean | `false` | Skip dashboard scraper |
| skipDetail | boolean | `false` | Skip detail info scraper |
| skipSearch | boolean | `false` | Skip search scraper |
| detailParams | Object | `{}` | Params for detail info |
| searchParams | Object | `{}` | Params for search |
| log | boolean | `true` | Show console logs |

**Returns:** `Promise<Object>` with keys: `dashboard`, `detail_info`, `search`

```javascript
const results = await scraper.scrapeAll({
    skipDashboard: true,
    detailParams: { shortPlayId: '123456' },
    searchParams: { searchCode: 'trending', pageNo: '1' }
});

console.log(results.dashboard);
console.log(results.detail_info);
console.log(results.search);
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
    if (searchResults && searchResults.data && searchResults.data.length > 0) {
        const firstVideo = searchResults.data[0];
        console.log('First video:', firstVideo.shortPlayName);
        
        const detail = await scraper.scrapeDetailInfo({
            shortPlayId: firstVideo.shortPlayId
        });
        console.log('Video details:', detail);
    }
    
    // Get dashboard
    const dashboard = await scraper.scrapeDashboard();
    console.log('Dashboard:', dashboard);
}

main();
```

Run:
```bash
node my-scraper.js
```

## 📁 Example: Batch Download URLs

Create `get-urls.js`:

```javascript
const scraper = require('./scraper');

async function getAllVideoUrls(shortPlayId) {
    const detail = await scraper.scrapeDetailInfo({ shortPlayId }, false);
    
    if (!detail || !detail.data || !detail.data.shortPlayEpisodeInfos) {
        console.log('No episodes found');
        return [];
    }
    
    const urls = detail.data.shortPlayEpisodeInfos.map(ep => ({
        episodeNo: ep.episodeNo,
        url: ep.playVoucher
    }));
    
    return urls;
}

// Usage
getAllVideoUrls('2027266000629530625').then(urls => {
    console.log(`Found ${urls.length} episodes:`);
    urls.forEach(ep => {
        console.log(`Episode ${ep.episodeNo}: ${ep.url}`);
    });
});
```

## 🔧 Configuration

Edit `scraper.js` to change:
- `PUBLIC_KEY` / `PRIVATE_KEY` - RSA keys
- Authorization bearer token in `sendAppRequest`
- Device code
- API version

## ⚠️ Disclaimer

This tool is for educational purposes only. Use responsibly and respect the API terms of service.
