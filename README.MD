# Scraping UOC courses with Apify

## Intro

This project fetches and scraps the syllabus of any Degree in UOC.
Behind the scenes it uses Apify with node.js and compromises two processes:

1. Spawn the PuppeteerCrawler to scrap all the desired data about the courses inside datasets
2. Read the datasets and transform them from json into xslx format.

### Goal

The Goal is to extract the information of the subjects of the syllabus and their evaluation mode into an xlsx so that we don't need to do the process manually.

## Execute

```bash

rm -rf apify_storage/request_queues/*
node index.js
node transform-dataset-to-xlsx.js

```

## TODO

* more gracefully handleFailedRequestFunction: async ({ request, error, }) => {
* remove jquery dependency to make it more robust and use (https://docs.apify.com/tutorials/apify-scrapers/puppeteer-scraper#last-run-date) this technique
* get to know lib for code: xabikos.javascriptsnippets

