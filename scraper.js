const crypto = require('crypto');
const axios = require('axios');

// =====================================================================
// 1. KONFIGURASI KUNCI RSA
// =====================================================================
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2poXMstZ8NCWE7915MXzDWC5/t+oB2waGfskPqSZwLqxd4ZBR0H1cb1tAZRZcV7P+LmOd6SYNxhnELaWuKTD+D3xkz8Tt1L5j/ynGqVt1MDbiQIEzXQKUkNDSH6T0A+Xzo/67/8QOQXlVJfW06resbaeNvibfx6Qc78j96bCIPlxPrtieilVTBHUFOXjirxK/ki/mO8P2smRbpt73fsQWdGmTGMfYGvfPApGyxbxLkL/qrBjU25XpM8a0MBqzFWUAchHmqSBJ6Mbfam1SSgf3b2U28s67nOW+JiOrhd6iVLcsLFxXA54HX+Zbej3AbOB6jKaEmp/bz1amneE1NYXwwIDAQAB\n-----END PUBLIC KEY-----`;

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCK0Tl1pd7bjTRU93bWoHW1hLCDj2+9bg1MgY8j5C7xXaw6bJfToXhWbH1fXNbnFFVqxyYNErcuOUwJZxyDgcxUXM4yWnRseb2GF97GOicAQ2keDzVYmwky4lrSRwvcXutJRLPUCRQNfc6upfk2G5TKh6/CcP4TV1eXTF7+vdEw2SHxAOITKbSfcaZXr/hVs6a1aRHsBF+7RG99ebwZIP6/AgIyqX9RbDVN6ixi1v2G3/bwAULHLSqGdSaqij/ca17fbFGITaeCeEaZ6d/P4ZuOK+PEPdbPQt6SbY4lZaYwRvdrpH73kigPITgDzIDONFybJ1m7wRKlq1wxWHwbimptAgMBAAECggEAPz3cYJXFtt5YphDrahJGLgEabYVOUc2ub1li/eX54OpdCWzpqneYnD7myyg/m5zu4SuDUVdibsOZuXrpSZw7m3+ATP5apgS8bDe5vTNHC16qqBAjrI9NHIp09/F4HNh9dq6/Am10XkUfgP+KTrU4DyDL2NijV+pltD8N1B5kDE1igokVcsavhnu2INoMRXYE78Wq6urNECuFWw9hldv81M9m2w56t1CQOUukpo4mfmLjZRe2s+kwtcBVefGHP8Cj0OeH2dGltjl2YSQMRBFUCVoixYpOrcjIHoqzWri8IfUZ2tW+nUvHl5IZ9RVxefnFaLGnxiXd2sk6Sn4aD/l9YQKBgQDVv3HaOZxHRqlNSPrNGqplGhE066HnDsq6MlPukiovxE43CRBmpTnk9zDCqrDh9t2HbJuao7nSq5WlBERWgwqXU/qDpH43W7Y/lJfHkDv6A2m0viJa0a9x8+CJpNnCDu1ATo4/IQKwoXYice6JKnUyXgkGKn+HipiN6tO0EtWHlQKBgQCmQfklKFtXtm/FZ6NIMs+d+EyvaE5xNLKGYQxmiCR10WGYd8ZV+K0Q6qXHS+a32TirWB9F3TqPOklTytMrfPZB3BCXj4weEldb8W716G8FYf7LLhaT+MdpF7KDcruObwoQAvKV3N4eX6tUEMmdrx9hpCmmIU5EeXUkhGdmwk7BeQKBgAIXMkThJV8pGMTRvuo8pYgBnkN3PoklAuSZU2rU8Sawc9dj9k4atZtAs7BjvQEoyffmHwt/KHUgCoGnrgdulq7uOlgJRtbBxeGPUYC5L2z9lY4YAfwDawThTsPp4dtdDAMCAbAqYX1axu4FUUD0MltAwjPWPJMVzvIsZs+vE3mVAoGAJPja3OaCmZjadj2709xoyypic0dw2j/ry3JdfZec9A5h87P/CTNJ2U81GoLIhe3qakAohDLUSPGfSOD74NnjMXYswmeLs0xE3Q9tq4XK2pmWPby8DJ/wSHCapByplN0gkbr2E1mQk5SW1xT8oPJGukH1eRpC+3s/D6XaEMH5HZECgYEAigoX5l39LDsCgeaUcI4S9grkaas/WsKv37eqo3oD9Qk6VFiMM5L5Zig6aXJxuAPLVjb38caJRPmPmOXLT2kEP1E1h6OJOhEhETwVIUtcBzsK25ju9LqL89bC+W0uS7BPvk6Tcws/tXHCkQCTgb9jVXceZ2ox+6axvlW/5WgHt5Q=\n-----END PRIVATE KEY-----`;

// =====================================================================
// 2. FUNGSI ENKRIPSI & DEKRIPSI
// =====================================================================
function generateRandomKey() {
    return crypto.randomBytes(16).toString('hex');
}

function encryptAES(text, key) {
    const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(key, 'utf8'), null);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptAES(encryptedBase64, key) {
    const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(key, 'utf8'), null);
    let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptRSA(text) {
    const buffer = Buffer.from(text, 'utf8');
    return crypto.publicEncrypt({
        key: PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer).toString('base64');
}

function decryptRSA(encryptedBase64) {
    const buffer = Buffer.from(encryptedBase64, 'base64');
    return crypto.privateDecrypt({
        key: PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer).toString('utf8');
}

// =====================================================================
// 3. FUNGSI UTAMA - API REQUEST
// =====================================================================
async function sendAppRequest(url, payload, log = true) {
    try {
        if (log) console.log(`\n[!] Menyiapkan payload untuk: ${url}`);

        const aesKey = generateRandomKey();
        const jsonStr = JSON.stringify(payload);
        const encryptedBody = encryptAES(jsonStr, aesKey);
        const base64AesKey = Buffer.from(aesKey, 'utf8').toString('base64');
        const encryptedKeyHeader = encryptRSA(base64AesKey);

        const headers = {
            'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjIwMzAxNzk5ODQwMjQ5ODE1MDUsInJuU3RyIjoiSkdsbTdSbGgyc2FycU5waHFLNzhEd0F2ZVhzZVE3R0MifQ.5GoO1n6e1wc-mqRe9rmzRSnGTAr7CnyKs-Dzj47cRYE',
            'canary': 'v1',
            'os': '1',
            'device-code': 'ab7d060a1c2a6b47',
            'version': '2.1.4',
            'timestamp': Date.now().toString(),
            'content-language': 'id_ID',
            'encrypt-key': encryptedKeyHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'okhttp/4.10.0'
        };

        if (log) console.log(`[>] Mengirim request...`);

        const response = await axios.post(url, encryptedBody, { headers });

        const responseEncryptedKey = response.headers['encrypt-key'];
        const responseEncryptedBody = response.data;

        if (responseEncryptedKey && responseEncryptedBody) {
            if (log) console.log(`[<] Response diterima. Melakukan dekripsi...`);

            const decryptedBase64Key = decryptRSA(responseEncryptedKey);
            const serverAesKey = Buffer.from(decryptedBase64Key, 'base64').toString('utf8');
            const finalJsonData = decryptAES(responseEncryptedBody, serverAesKey);
            const parsedData = JSON.parse(finalJsonData);

            if (log) {
                console.log("\n✅ HASIL DEKRIPSI SERVER:");
                console.dir(parsedData, { depth: null, colors: true });
            }

            return parsedData;
        } else {
            if (log) console.log("[-] Server tidak mengembalikan data terenkripsi.");
            return null;
        }

    } catch (error) {
        console.error("\n❌ ERROR API CALL:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        return null;
    }
}

// =====================================================================
// 4. ENDPOINTS
// =====================================================================
const ENDPOINTS = {
    dashboard: {
        url: 'https://appsecapi.netshort.com/prod-app-api/video/shortPlay/tab/load_group_tabId',
        payload: {}
    },
    detail_info: {
        url: 'https://appsecapi.netshort.com/prod-app-api/video/shortPlay/base/detail_info',
        payload: (params) => ({
            codec: params?.codec || 'h265',
            shortPlayId: params?.shortPlayId || '2027266000629530625',
            playClarity: params?.playClarity || '1080p'
        })
    },
    search: {
        url: 'https://appsecapi.netshort.com/prod-app-api/video/shortPlay/search/searchByKeyword',
        payload: (params) => ({
            searchFlag: params?.searchFlag || '1',
            pageNo: params?.pageNo || '1',
            pageSize: params?.pageSize || '20',
            searchCode: params?.searchCode || 'ceo'
        })
    }
};

// =====================================================================
// 5. PUBLIC API - MODULE EXPORTS
// =====================================================================

/**
 * Scrape dashboard data
 * @param {boolean} log - Show logs
 * @returns {Promise<Object|null>} Dashboard data
 */
async function scrapeDashboard(log = true) {
    if (log) console.log('\n[+] Scraping Dashboard...');
    const result = await sendAppRequest(ENDPOINTS.dashboard.url, ENDPOINTS.dashboard.payload, log);
    if (log) console.log('[✓] Dashboard completed');
    return result;
}

/**
 * Scrape detail info for a specific video
 * @param {Object} params - Parameters
 * @param {string} params.shortPlayId - Video ID
 * @param {string} params.codec - Codec (h265/h264)
 * @param {string} params.playClarity - Quality (1080p/720p/etc)
 * @param {boolean} log - Show logs
 * @returns {Promise<Object|null>} Detail info data
 */
async function scrapeDetailInfo(params = {}, log = true) {
    if (log) console.log('\n[+] Scraping Detail Info...');
    const payload = ENDPOINTS.detail_info.payload(params);
    if (log) console.log(`    Params: codec=${payload.codec}, shortPlayId=${payload.shortPlayId}, playClarity=${payload.playClarity}`);
    const result = await sendAppRequest(ENDPOINTS.detail_info.url, payload, log);
    if (log) console.log('[✓] Detail Info completed');
    return result;
}

/**
 * Search videos by keyword
 * @param {Object} params - Search parameters
 * @param {string} params.searchCode - Search keyword
 * @param {string} params.pageNo - Page number
 * @param {string} params.pageSize - Results per page
 * @param {string} params.searchFlag - Search flag
 * @param {boolean} log - Show logs
 * @returns {Promise<Object|null>} Search results
 */
async function scrapeSearch(params = {}, log = true) {
    if (log) console.log('\n[+] Scraping Search...');
    const payload = ENDPOINTS.search.payload(params);
    if (log) console.log(`    Params: searchCode=${payload.searchCode}, pageNo=${payload.pageNo}, pageSize=${payload.pageSize}`);
    const result = await sendAppRequest(ENDPOINTS.search.url, payload, log);
    if (log) console.log('[✓] Search completed');
    return result;
}

/**
 * Run all scrapers
 * @param {Object} options - Options
 * @param {boolean} options.skipDashboard - Skip dashboard
 * @param {boolean} options.skipDetail - Skip detail info
 * @param {boolean} options.skipSearch - Skip search
 * @param {Object} options.detailParams - Params for detail info
 * @param {Object} options.searchParams - Params for search
 * @param {boolean} options.log - Show logs
 * @returns {Promise<Object>} All results
 */
async function scrapeAll(options = {}) {
    const { 
        skipDashboard = false, 
        skipDetail = false, 
        skipSearch = false,
        detailParams = {},
        searchParams = {},
        log = true
    } = options;

    if (log) {
        console.log('='.repeat(60));
        console.log('       AUTOMATED SCRAPER - NETSHORT API');
        console.log('='.repeat(60));
    }

    const results = {};

    if (!skipDashboard) {
        results.dashboard = await scrapeDashboard(log);
    }

    if (!skipDetail) {
        results.detail_info = await scrapeDetailInfo(detailParams, log);
    }

    if (!skipSearch) {
        results.search = await scrapeSearch(searchParams, log);
    }

    if (log) {
        console.log('\n' + '='.repeat(60));
        console.log('✅ SCRAPING COMPLETED');
        console.log('='.repeat(60));
    }

    return results;
}

// =====================================================================
// 6. CLI INTERFACE
// =====================================================================
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'all') {
        await scrapeAll({
            detailParams: { shortPlayId: args[1] || '2027266000629530625' },
            searchParams: { searchCode: args[2] || 'ceo' }
        });
    } else if (command === 'dashboard') {
        await scrapeDashboard(true);
    } else if (command === 'detail') {
        const shortPlayId = args[1] || '2027266000629530625';
        await scrapeDetailInfo({ shortPlayId }, true);
    } else if (command === 'search') {
        const keyword = args[1] || 'ceo';
        const page = args[2] || '1';
        await scrapeSearch({ searchCode: keyword, pageNo: page }, true);
    } else {
        console.log(`
Usage: node scraper.js [command] [options]

Commands:
  all [shortPlayId] [keyword]  - Run all scrapers (default)
  dashboard                     - Scrape dashboard only
  detail [shortPlayId]         - Scrape detail info
  search [keyword] [page]      - Search by keyword

Examples:
  node scraper.js
  node scraper.js all 2027266000629530625 funny
  node scraper.js dashboard
  node scraper.js detail 2027266000629530625
  node scraper.js search comedy 1
`);
    }
}

// Run CLI if executed directly
if (require.main === module) {
    main();
}

// Export module
module.exports = {
    scrapeDashboard,
    scrapeDetailInfo,
    scrapeSearch,
    scrapeAll,
    ENDPOINTS
};
