#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const axios = require('axios')
const Table = require('cli-table');

const table = new Table({
    head: [
        chalk.magenta('Rank'),
        chalk.magenta('Symbol'), 
        chalk.magenta('Name'), 
        chalk.magenta('Price($)'),
        chalk.magenta('24H Vol'),
        chalk.magenta('Market Cap'),
        chalk.magenta('Change 1H'),
        chalk.magenta('Change 24H'),
        chalk.magenta('Change 7D')
    ],
    chars: { 
        'top': '═' , 
        'top-mid': '╤' , 
        'top-left': '╔' , 
        'top-right': '╗', 
        'bottom': '═' , 
        'bottom-mid': '╧' , 
        'bottom-left': '╚' , 
        'bottom-right': '╝', 
        'left': '║' , 
        'left-mid': '╟' , 
        'mid': '─' , 'mid-mid': '┼', 
        'right': '║' , 
        'right-mid': '╢' , 
        'middle': '│' 
    }});

const convertNum = (labelValue) => {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
      : Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
      : Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
      : Math.abs(Number(labelValue));
  };

program
  .version("1.0.1")
  .description("A CLI Tool to get latest cryptocurrency prices");

  program
  .command("all")
  .description("Get top 100 popular crypto prices and other info")
  .action(() => {
    axios("https://api.coinlore.net/api/tickers/")
      .then(res=>{
          res?.data?.data.forEach(el=>{
            table.push([el?.rank,el?.symbol,
                el?.name,el?.price_usd,
                convertNum(el?.volume24),
                convertNum(el?.market_cap_usd),
                el?.percent_change_1h>0?chalk.green(el?.percent_change_1h):chalk.red(el?.percent_change_1h),
                el?.percent_change_24h>0?chalk.green(el?.percent_change_24h):chalk.red(el?.percent_change_24h),
                el?.percent_change_7d>0?chalk.green(el?.percent_change_7d):chalk.red(el?.percent_change_7d)
            ])
          })
          console.log(table.toString());
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })
  program
  .command("get <name>")
  .description("Get cryptocurrency info by name")
  .action((name) => {
    axios("https://api.coinlore.net/api/tickers/")
      .then(res=>{
          const ele = res?.data?.data.filter(el=>el?.name.toLowerCase().includes(name.toLowerCase()))
          ele?.map(el=>{
            table.push([el?.rank,el?.symbol,
              el?.name,el?.price_usd,
              convertNum(el?.volume24),
              convertNum(el?.market_cap_usd),
              el?.percent_change_1h>0?chalk.green(el?.percent_change_1h):chalk.red(el?.percent_change_1h),
              el?.percent_change_24h>0?chalk.green(el?.percent_change_24h):chalk.red(el?.percent_change_24h),
              el?.percent_change_7d>0?chalk.green(el?.percent_change_7d):chalk.red(el?.percent_change_7d)
          ])
          })
          console.log(table.toString());
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })
  program
  .command("top <number>")
  .description("Get top n popular crypto prices and other info")
  .action((number) => {
    axios("https://api.coinlore.net/api/tickers/")
      .then(res=>{
        res?.data?.data.slice(0,number).forEach(el=>{
            table.push([el?.rank,el?.symbol,
                el?.name,el?.price_usd,
                convertNum(el?.volume24),
                convertNum(el?.market_cap_usd),
                el?.percent_change_1h>0?chalk.green(el?.percent_change_1h):chalk.red(el?.percent_change_1h),
                el?.percent_change_24h>0?chalk.green(el?.percent_change_24h):chalk.red(el?.percent_change_24h),
                el?.percent_change_7d>0?chalk.green(el?.percent_change_7d):chalk.red(el?.percent_change_7d)
            ])
          })
          console.log(table.toString());
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })

  program.parse(process.argv);
