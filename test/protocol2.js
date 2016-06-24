'use strict'
/* eslint-env node, mocha */

const expect = require('chai').expect
const cheerio = require('cheerio')

require('./common/setupIOC')()
const protocol2 = require('../lib/routes/protocol2')

suite('Protocol 2')

test('validates service ticket in parameters', function validateST (done) {
  const request = {
    params: {
      service: 'http://example.com/',
      ticket: 'valid-st'
    },
    method: 'get'
  }

  function reply (response) {
    const $ = cheerio.load(response)
    const ele = $('cas\\:authenticationSuccess')
    expect(ele.length).to.equal(1)

    const user = $('cas\\:user', ele)
    expect(user.length).to.equal(1)
    expect(user.text()).to.equal('fbar')
    done()
  }

  protocol2[0].handler(request, reply)
})

test('validates service ticket in query', function validateSTQuery (done) {
  const request = {
    query: {
      service: 'http://example.com/',
      ticket: 'valid-st'
    },
    method: 'get'
  }

  function reply (response) {
    const $ = cheerio.load(response)
    const ele = $('cas\\:authenticationSuccess')
    expect(ele.length).to.equal(1)

    const user = $('cas\\:user', ele)
    expect(user.length).to.equal(1)
    expect(user.text()).to.equal('fbar')
    done()
  }

  protocol2[0].handler(request, reply)
})

test('rejects bad service ticket', function rejectBadTicket (done) {
  const request = {
    params: {
      service: 'http://example.com/',
      ticket: 'unknown'
    },
    method: 'get'
  }

  function reply (response) {
    const $ = cheerio.load(response)
    const ele = $('cas\\:authenticationFailure')
    expect(ele.length).to.equal(1)
    expect(ele.attr('code')).to.equal('INVALID_TICKET')
    done()
  }

  protocol2[0].handler(request, reply)
})

test('rejects expired service ticket', function rejectBadTicket (done) {
  const request = {
    params: {
      service: 'http://example.com/',
      ticket: 'expired-st'
    },
    method: 'get'
  }

  function reply (response) {
    const $ = cheerio.load(response)
    const ele = $('cas\\:authenticationFailure')
    expect(ele.length).to.equal(1)
    expect(ele.attr('code')).to.equal('INVALID_TICKET')
    done()
  }

  protocol2[0].handler(request, reply)
})
