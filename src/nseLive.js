const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

class NSELive {
  constructor() {
    this.jar = new CookieJar();
    this.session = wrapper(
      axios.create({
        baseURL: 'https://www.nseindia.com/api',
        jar: this.jar,
        withCredentials: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
          Accept: '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Connection: 'keep-alive',
        },
      })
    );
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    try {
      await this.session.get('https://www.nseindia.com');
      this.initialized = true;
    } catch (error) {
      console.error(`Initialization error: ${error.message}`);
      throw new Error('Failed to initialize NSE Live session.');
    }
  }

  async request(route, params = {}, method = 'get') {
    await this.initialize();
    try {
      const response = await this.session[method](route, { params });
      return response.data || { message: 'No data available.' };
    } catch (error) {
      console.error(`Request error: ${error.message}`);
      throw new Error(error.response?.data?.message || 'Failed to fetch data.');
    }
  }

  // Public API Methods

  // Stock-related Methods
  stockQuote(symbol) {
    return this.request('/quote-equity', { symbol });
  }

  stockQuoteFNO(symbol) {
    return this.request('/quote-derivative', { symbol });
  }

  tradeInfo(symbol) {
    return this.request('/quote-equity', { symbol, section: 'trade_info' });
  }

  // Market Status
  marketStatus() {
    return this.request('/marketStatus');
  }

  // Index Methods
  allIndices() {
    return this.request('/allIndices');
  }

  liveIndex(symbol = 'NIFTY 50') {
    return this.request('/equity-stockIndices', { index: symbol });
  }

  indexOptionChain(symbol = 'NIFTY') {
    return this.request('/option-chain-indices', { symbol });
  }

  // Historical Data
  historicalDataIndices(from = '01-01-2023', to = '01-01-2024') {
    return this.request('/historical/indicesHistory', { indexType: 'NIFTY 50', from, to });
  }

  historicalDataIndiavix(from = '01-01-2023', to = '01-01-2024') {
    return this.request('/historical/vixhistory', { from, to });
  }

  // Corporate Actions
  corporateAnnouncements() {
    return this.request('/home-corporate-announcements', { index: 'homepage' });
  }

  corporateActions(index, from_date, to_date) {
    return this.request('/corporates-corporateActions', { index, from_date, to_date });
  }

  // Analysis Methods
  priceBandHitter() {
    return this.request('/live-analysis-price-band-hitter');
  }

  volumeGainers() {
    return this.request('/live-analysis-volume-gainers');
  }

  gainersAndLosers() {
    return this.request('/liveanalysis/gainers/allSec');
  }

  mostActiveSecurities(limit = 10, type = 'value') {
    return this.request('/live-analysis-most-active-securities', { index: type, limit });
  }

  // Turnover Methods
  marketTurnover() {
    return this.request('/market-turnover');
  }

  equityDerivativeTurnover(type = 'allcontracts') {
    return this.request('/equity-stock', { index: type });
  }

  // Other Methods
  holidayList() {
    return this.request('/holiday-master', { type: 'trading' });
  }

  capitalmarketSnapshot() {
    return this.request('/snapshot-capital-market-ews');
  }

  financialResults(period = 'Quarterly') {
    return this.request('/corporates-financial-results', { index: 'equities', period });
  }

  // Upcoming Issues
  ipoAndRightsIssue(category = 'ipo') {
    return this.request('/all-upcoming-issues', { category });
  }

  // Rights and Issues
  rightsIssue() {
    return this.request('/liveWatchRights-issues', { index: 'activeIssues' });
  }
}

module.exports = NSELive;
