const Cookies = require('../src/Santa.ts').default;
const { expect } = require('chai');

describe('Cookies', () => {
  beforeEach(() => {
    // Limpia las cookies antes de cada prueba
    document.cookie = '';
  });

  it('should set and get a cookie', () => {
    const cookieManager = new Cookies();
    cookieManager.set('cookieName', 'cookieValue');
    const result = cookieManager.get('cookieName');
    expect(result).to.equal('cookieValue');
  });

  it('should remove a cookie', () => {
    const cookieManager = new Cookies();
    cookieManager.set('cookieName', 'cookieValue');
    cookieManager.remove('cookieName');
    const result = cookieManager.get('cookieName');
    expect(result).to.be.undefined;
  });

  it('should clear all cookies', () => {
    const cookieManager = new Cookies();
    cookieManager.set('cookie1', 'value1');
    cookieManager.set('cookie2', 'value2');
    cookieManager.clear();
    const result1 = cookieManager.get('cookie1');
    const result2 = cookieManager.get('cookie2');
    expect(result1).to.be.undefined;
    expect(result2).to.be.undefined;
  });
});

