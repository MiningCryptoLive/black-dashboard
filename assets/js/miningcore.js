/*!
  * Miningcore.js v1.02
  * Copyright 2020 Authors (https://github.com/minernl/Miningcore)
  */

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// Current running domain (or ip address) url will be read from the browser url bar.
// You can check the result in you browser development view -> F12 -> Console 
// -->> !! no need to change anything below here !! <<--
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

// read WebURL from current browser
var WebURL         = "https://bch.solopool.pro";  // Website URL is:  https://domain.com/
// WebURL correction if not ends with /
if (WebURL.substring(WebURL.length-1) != "/")
{
	WebURL = WebURL + "/";
	console.log('Corrected WebURL, does not end with / -> New WebURL : ', WebURL);
}
var API            = "https://bch.solopool.pro/api/";   						// API address is:  https://domain.com/api/
// API correction if not ends with /
if (API.substring(API.length-1) != "/")
{
	API = API + "/";
	console.log('Corrected API, does not end with / -> New API : ', API);
} 
var stratumAddress = "bch.solopool.pro";           				// Stratum address is:  domain.com








// --------------------------------------------------------------------------------------------
// no need to change anything below here
// --------------------------------------------------------------------------------------------
console.log('MiningCore.WebUI : ', WebURL);		                      // Returns website URL
console.log('API address used : ', API);                                      // Returns API URL
console.log('Stratum address  : ', "stratum+tcp://" + stratumAddress + ":");  // Returns Stratum URL
console.log('Page Load        : ', window.location.href);                     // Returns full URL

currentPage = "index"

// check browser compatibility
var nua = navigator.userAgent;
//var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
var is_IE = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Trident') > -1) && !(nua.indexOf('Chrome') > -1));
if(is_IE) {
	console.log('Running in IE browser is not supported - ', nua);
}

// Load INDEX Page content
function loadIndex() {
  $("div[class^='page-").hide();
  $(".page").hide();
  //$(".page-header").show();
  $(".page-wrapper").show();
  $(".page-footer").show();

  var hashList = window.location.hash.split(/[#/?=]/);
  //var fullHash = document.URL.substr(document.URL.indexOf('#')+1);   //IE
  // example: #vtc/dashboard?address=VttsC2.....LXk9NJU
  currentPool = hashList[1];
  currentPage = hashList[2];
  currentAddress = hashList[3];
  if (currentPool && !currentPage) {
    currentPage = "stats"
  }
  else if (!currentPool && !currentPage) {
    currentPage = "index";
  }
  if (currentPool && currentPage) {
    loadNavigation();
    $(".main-index").hide();
    $(".main-pool").show();
    $(".page-" + currentPage).show();
    $(".main-sidebar").show();
  } else {
    $(".main-index").show();
    $(".main-pool").hide();
    $(".page-index").show();
    $(".main-sidebar").hide();
  }

  if (currentPool) {
    $("li[class^='nav-']").removeClass("active");
    switch (currentPage) {
      case "stats":
        console.log('Loading stats page content');
        $(".nav-stats").addClass("active");
        loadStatsPage();
        break;
      case "dashboard":
        console.log('Loading dashboard page content');
        $(".nav-dashboard").addClass("active");
        loadDashboardPage();
        break;
      case "miners":
        console.log('Loading miners page content');
        $(".nav-miners").addClass("active");
        loadMinersPage();
        break;
      case "blocks":
        console.log('Loading blocks page content');
        $(".nav-blocks").addClass("active");
        loadBlocksPage();
        break;
      case "payments":
        console.log('Loading payments page content');
        $(".nav-payments").addClass("active");
        loadPaymentsPage();
        break;
      case "connect":
        console.log('Loading connect page content');
        $(".nav-connect").addClass("active");
        loadConnectPage();
        break;
      case "software":
        console.log('Loading software page content');
        $(".nav-software").addClass("active");
        break;
      case "faq":
        console.log('Loading faq page content');
        $(".nav-faq").addClass("active");
        break;
      case "links":
        console.log('Loading links page content');
        $(".nav-links").addClass("active");
        break;
      case "support":
        console.log('Loading support page content');
        $(".nav-support").addClass("active");
        break;
      case "markets":
        console.log('Loading exchanges page content');
        $(".nav-markets").addClass("active");
        break;
      case "calculators":
        console.log('Loading calculators page content');
        $(".nav-calculators").addClass("active");
        break;
      default:
      // default if nothing above fits
    }
  } else {
    // Load the default page on page load
    loadHomePage();

    // Add click handlers to the SOLO and PPLNS buttons
    $("#solo-btn").on("click", function () {
      loadHomePage(payoutScheme = "SOLO");
    });

    $("#pplns-btn").on("click", function () {
      loadHomePage(payoutScheme = "PPLNS");
    });
    // loadCoinPrice();
    // loadAllCoins();
  }
  scrollPageTop();
}

// Load HOME page content
function loadHomePage(payoutScheme = "PPLNS") {
  console.log('Loading home page content');
  return $.ajax(API + "pools")
    .done(function (data) {
      const poolCoinCardTemplate = $(".index-coin-card-template").html();
      var poolCoinTableTemplate = "";
      $.each(data.pools, function (index, value) {
        if (value.paymentProcessing.payoutScheme === payoutScheme) {
          var coinLogo = "<img class='coinimg' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
          var coinName = value.coin.name;
          if (typeof coinName === "undefined" || coinName === null) { coinName = value.coin.type; }
          poolCoinTableTemplate += "<tr class='coin-table-row' href='#" + value.id + "'>";
          poolCoinTableTemplate += "<td class='coin'><a href='#" + value.id + "'<span>" + coinLogo + coinName + " " + "(" + value.paymentProcessing.payoutScheme.toUpperCase() + ")" + " </span></a></td>";
          poolCoinTableTemplate += "<td class='algo'>" + value.coin.algorithm + "</td>";
          poolCoinTableTemplate += "<td class='fee'>" + value.poolFeePercent + " %</td>";
          poolCoinTableTemplate += "<td class='minimum-payment'>" + (value.paymentProcessing.minimumPayment.toLocaleString() + " " + "(" + value.coin.type + ")") + "</td>";
          poolCoinTableTemplate += "<td class='miners'>" + value.poolStats.connectedMiners + "</td>";
          if (value.coin.algorithm === "Equihash") poolCoinTableTemplate += "<td class='pool-hash'>" + _formatter(value.poolStats.poolHashrate, 2, "Sol/s") + "</td>";
          else poolCoinTableTemplate += "<td class='pool-hash'>" + _formatter(value.poolStats.poolHashrate, 2, "H/s") + "</td>";
          poolCoinTableTemplate += "<td class='poolEffort'>" + _formatter(value.poolEffort * 100, 2, "%") + "</td>";
          poolCoinTableTemplate += "<td class='poolBlocks'>" + value.totalBlocks.toLocaleString() + "</td>";
          poolCoinTableTemplate += "<td class='net-share'>" + _formatter(value.poolStats.poolHashrate / value.networkStats.networkHashrate * 100, 2, "%") + "</td>";
          if (value.coin.algorithm === "Equihash") poolCoinTableTemplate += "<td class='net-hash'>" + _formatter(value.networkStats.networkHashrate, 2, "Sol/s") + "</td>";
          else poolCoinTableTemplate += "<td class='net-hash'>" + _formatter(value.networkStats.networkHashrate, 2, "H/s") + "</td>";
          poolCoinTableTemplate += "<td class='net-diff'>" + _formatter(value.networkStats.networkDifficulty, 2, "") + "</td>";
          poolCoinTableTemplate += "<td class='blockheight'>" + Intl.NumberFormat().format(value.networkStats.blockHeight) + "</td>";
          if (value.networkStats.networkHashrate === 0) poolCoinTableTemplate += "<td class='poolStatus'>âŒ Offline</td>";
          else poolCoinTableTemplate += "<td class='poolStatus'>âœ… Online</td>";
          poolCoinTableTemplate += "</tr>";
          // let poolFee = value.poolFeePercent;
          // let pplnsBtn = document.getElementById("pplns-btn");
          // pplnsBtn.textContent += ' ' + poolFee + '% for all coins on this pool';
        }
      });
      $(".pool-coin-table").html(poolCoinTableTemplate);

      // Make table sortable
      $($.bootstrapSortable);
    })
    .fail(function () {
      var poolCoinTableTemplate = "";
      poolCoinTableTemplate += "<tr><td colspan='8'> ";
      poolCoinTableTemplate += "<div class='alert alert-warning'>"
      poolCoinTableTemplate += "	<h4><i class='fas fa-exclamation-triangle'></i> Warning! <i class='fas fa-exclamation-triangle'></i></h4>";
      poolCoinTableTemplate += "	<hr>";
      poolCoinTableTemplate += "	<p>The pool is currently down for maintenance...</p>";
      poolCoinTableTemplate += "	<p>Mining is not affected during this time...</p>";
      poolCoinTableTemplate += "	<p>Check our discord channel for updates..</p>";
      poolCoinTableTemplate += " <a href='https://discord.gg/WDXMNfBuVD' target='_blank'>";
      poolCoinTableTemplate += "   <img";
      poolCoinTableTemplate += "     src='img/discordmini1.png'";
      poolCoinTableTemplate += "     alt=''";
      poolCoinTableTemplate += "     style='width: 130px; height: 130px'";
      poolCoinTableTemplate += "   />";
      poolCoinTableTemplate += " </a>";
      poolCoinTableTemplate += "</div>"
      poolCoinTableTemplate += "</td></tr>";
      $(".pool-coin-table").html(poolCoinTableTemplate);
    });
}


// Load STATS page content
function loadStatsPage() {
  //clearInterval();
  setInterval(
    (function load() {
      loadStatsData();
      return load;
    })(),
    60000
  );
  setInterval(
    (function load() {
      loadStatsChart();
      return load;
    })(),
    600000
  );
  setInterval(
    (function load() {
      loadWorkerTTFBlocks();
      return load;
    })(),
    60000
  );
}

// Load DASHBOARD page content
function loadDashboardPage() {
  function render() {
    //clearInterval();
    setInterval(
      (function load() {
        loadDashboardData($("#walletAddress").val());
        loadDashboardWorkerList($("#walletAddress").val());
        loadDashboardChart($("#walletAddress").val());
        loadUserBalanceData($("#walletAddress").val());
        loadWorkerTTFBlocks($("#walletAddress").val());
        // loadCoinPrice($().val());
        return load;
      })(),
      60000
    );
    // setInterval(
    //   (function load() {
    //     GetCoinData($("#walletAddress").val());
    //     return load;
    //   })(),
    //   43200000
    // );
  }
  var walletQueryString = window.location.hash.split(/[#/?]/)[3];
  if (walletQueryString) {
    var wallet = window.location.hash.split(/[#/?]/)[3].replace("address=", "");
    if (wallet) {
      $(walletAddress).val(wallet);
      localStorage.setItem(currentPool + "-walletAddress", wallet);
      render();
    }
  }
  if (localStorage[currentPool + "-walletAddress"]) {
    $("#walletAddress").val(localStorage[currentPool + "-walletAddress"]);
  }
}

// Load Coin Prices
// function GetCoinData() {
//   console.log("Loading coin data from Coin Gecko...");
//   const coinSymbols = ["radiant", "optical-bitcoin", "dash", "digibyte", "zencash", "dogecoin", "peercoin", "vertcoin", "bitcoin-gold", "raptoreum", "bitoreum", "maza"];
//   fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + coinSymbols.join(", ") + "&vs_currencies=usd")
//     .then(response => response.json())
//     .then(data => {
//       coinSymbols.forEach(function (coin) {
//         console.log("Coin: " + coin + " Value: " + data[coin]);
//       });
//     })
//     .catch(error => {
//       console.error("Error fetching data:", error);
//     });
// }
function getPDNUSDValue() {
  fetch('https://xeggex.com/api/v2/asset/getbyticker/pdn')
    .then(response => response.json())
    .then(data => {
      const pdnUsdValue = data.data[0].usdValue;
      document.getElementById("pdn-usd-value").textContent = pdnUsdValue;
    })
    .catch(error => console.error(error));
}

// Load MINERS page content
function loadMinersPage() {
  console.log("load miners page");
  return $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=20")
    .done(function (data) {
      var minerList = "";
      if (data.length > 0) {
        $.each(data, function (index, value) {
          minerList += "<tr>";
          //minerList +=   "<td>" + value.miner + "</td>";
          minerList += '<td><a onClick="window.location=\'' + HVK.url + '#' + currentPool + '/dashboard?address=' + value.miner + '\'">' + value.miner + '</a></td>';
          // minerList += '<td>' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          //minerList += '<td><a href="' + value.minerAddressInfoLink + '" target="_blank">' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          if (currentPool === "btgpool" || currentPool === "btgpool2" || currentPool === "zen1" || currentPool === "zensolo" || currentPool === "zcl1") {
            minerList += "<td>" + _formatter(value.hashrate, 2, "Sol/s") + "</td>";
          } else {
            minerList += "<td>" + _formatter(value.hashrate, 2, "H/s") + "</td>";
          }

          minerList += "<td>" + _formatter(value.sharesPerSecond, 2, "S/s") + "</td>";
          minerList += "</tr>";
        });
      } else {
        minerList += '<tr><td colspan="4">No miner connected</td></tr>';
      }
      $("#minerList").html(minerList);
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadMinersList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Load BLOCKS page content
function loadBlocksPage() {
  console.log("loadBlocksPage");
  return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=100")
    .done(function (data) {
      var blockList = "";
      if (data.length > 0) {
        $.each(data, function (index, value) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created), false);
          var effort = Math.round(value.effort * 100);
          var effortClass = "";
          if (effort < 30) {
            effortClass = "effort1";
          } else if (effort < 80) {
            effortClass = "effort2";
          } else if (effort < 110) {
            effortClass = "effort3";
          } else {
            effortClass = "effort4";
          }
          blockList += "<tr>";
          blockList += "<td>" + createDate.toLocaleString('en-US', { hour12: false, timeZoneName: 'short' }) + "</td>";
          blockList += "<td><a href='" + value.infoLink + "' target='_blank'>" + value.blockHeight + "</a></td>";
          blockList += "<td>" + value.miner + "</td>";
          if (typeof value.effort !== "undefined") {
            blockList += "<td class='" + effortClass + "'>" + effort + "%</td>";
          } else {
            blockList += "<td>n/a</td>";
          }
          var status = value.status;
          blockList += "<td>" + status + "</td>";
          blockList += "<td>" + _formatter(value.reward, 5, "") + "</td>";
          // blockList += "<td><div class='c100 small p" + Math.round(value.confirmationProgress * 100) + "'><span>" + Math.round(value.confirmationProgress * 100) + "%</span><div class='slice'><div class='bar'></div><div class='fill'></div></div></div></td>";
          blockList += '<td><div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + Math.round(value.confirmationProgress * 100) + '%;" aria-valuenow="' + Math.round(value.confirmationProgress * 100) + '" aria-valuemin="0" aria-valuemax="100">' + Math.round(value.confirmationProgress * 100) + '%</div></div></td>';
          blockList += "</tr>";
        });
      } else {
        blockList += '<tr><td colspan="6">No blocks found yet</td></tr>';
      }

      $("#blockList").html(blockList);
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadBlocksList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Load PAYMENTS page content
function loadPaymentsPage() {
  console.log("loadPaymentsPage");
  return $.ajax(API + "pools/" + currentPool + "/payments?page=0&pageSize=500")
    .done(function (data) {
      var paymentList = "";
      if (data.length > 0) {
        $.each(data, function (index, value) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created), false);
          paymentList += '<tr>';
          paymentList += "<td>" + createDate.toLocaleString('en-US', { hour12: false, timeZoneName: 'short' }) + "</td>";
          paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address + '</td>';
          // paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 5) + ' &hellip; ' + value.address.substring(value.address.length - 5) + '</td>';
          paymentList += '<td>' + _formatter(value.amount, 5, '') + '</td>';
          paymentList += '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 5) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 5) + ' </a></td>';
          paymentList += '</tr>';
        });
      } else {
        paymentList += '<tr><td colspan="4">No payments found yet</td></tr>';
      }
      $("#paymentList").html(paymentList);
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadPaymentsList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Load CONNECTION page content
function loadConnectPage() {
  console.log("loadConnectPage");
  return $.ajax(API + "pools")
    .done(function (data) {
      var connectPoolConfig = "";
      $.each(data.pools, function (index, value) {
        if (currentPool === value.id) {
          defaultPort = Object.keys(value.ports)[0];
          coinName = value.coin.name;
          coinType = value.coin.type.toLowerCase();
          algorithm = value.coin.algorithm;
          // Connect Pool config table
          connectPoolConfig += "<tr><td>Coin</td><td>" + coinName + " (" + value.coin.type + ") </td></tr>";
          //connectPoolConfig += "<tr><td>Coin Family line </td><td>" + value.coin.family + "</td></tr>";
          connectPoolConfig += "<tr><td>Coin Algorithm</td><td>" + value.coin.algorithm + "</td></tr>";
          connectPoolConfig += '<tr><td>Pool Wallet</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + " &hellip; " + value.address.substring(value.address.length - 12) + "</a></td></tr>";
          connectPoolConfig += "<tr><td>Payout Scheme</td><td>" + value.paymentProcessing.payoutScheme + "</td></tr>";
          connectPoolConfig += "<tr><td>Minimum Payment</td><td>" + value.paymentProcessing.minimumPayment + " " + value.coin.type + "</td></tr>";
          if (typeof value.paymentProcessing.minimumPaymentToPaymentId !== "undefined") {
            connectPoolConfig += "<tr><td>Minimum Payout (to Exchange)</td><td>" + value.paymentProcessing.minimumPaymentToPaymentId + "</td></tr>";
          }
          connectPoolConfig += "<tr><td>Pool Fee</td><td>" + value.poolFeePercent + "%</td></tr>";
          $.each(value.ports, function (port, options) {
            connectPoolConfig += "<tr><td>stratum+tcp://" + stratumAddress + ":" + port + "</td><td>";
            if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
              connectPoolConfig += "Difficulty Variable / " + options.varDiff.minDiff + " &harr; ";
              if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
                connectPoolConfig += "&infin; " + options.name;
              } else {
                connectPoolConfig += options.varDiff.maxDiff;
              }
            } else {
              connectPoolConfig += "Difficulty Static / " + options.difficulty;
            }
            connectPoolConfig += "</td></tr>";
          });
        }
      });
      connectPoolConfig += "</tbody>";
      $("#connectPoolConfig").html(connectPoolConfig);
      // Connect Miner config 
      $("#miner-config").html("");
      $("#miner-config").load("poolconfig/" + coinType + ".html",
        function (response, status, xhr) {
          if (status == "error") {
            $("#miner-config").load("poolconfig/default.html",
              function (responseText) {
                var config = $("#miner-config")
                  .html()
                  .replace(/{{ stratumAddress }}/g, coinType + "." + stratumAddress + ":" + defaultPort)
                  .replace(/{{ coinName }}/g, coinName)
                  .replace(/{{ aglorithm }}/g, algorithm);
                $(this).html(config);
              }
            );
          } else {
            var config = $("#miner-config")
              .html()
              .replace(/{{ stratumAddress }}/g, coinType + "." + stratumAddress + ":" + defaultPort)
              .replace(/{{ coinName }}/g, coinName)
              .replace(/{{ aglorithm }}/g, algorithm);
            $(this).html(config);
          }
        }
      );
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadConnectConfig)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Dashboard - load wallet stats
function loadWallet() {
  console.log('Loading wallet address:', $("#walletAddress").val());
  if ($("#walletAddress").val().length > 0) {
    localStorage.setItem(currentPool + "-walletAddress", $("#walletAddress").val());
  }
  var coin = window.location.hash.split(/[#/?]/)[1];
  var currentPage = window.location.hash.split(/[#/?]/)[2] || "stats";
  window.location.href = "#" + currentPool + "/" + currentPage + "?address=" + $("#walletAddress").val();
}

// General formatter function
function _formatter(value, decimal, unit) {
  if (value === 0) {
    return "0 " + unit;
  } else {
    var si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
      { value: 1e21, symbol: "Z" },
      { value: 1e24, symbol: "Y" }
    ];
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
  }
}

// Time convert Local -> UTC
function convertLocalDateToUTCDate(date, toUTC) {
  date = new Date(date);
  //Local time converted to UTC
  var localOffset = date.getTimezoneOffset() * 60000;
  var localTime = date.getTime();
  if (toUTC) {
    date = localTime + localOffset;
  } else {
    date = localTime - localOffset;
  }
  newDate = new Date(date);
  return newDate;
}

// Time convert UTC -> Local
function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  var localOffset = date.getTimezoneOffset() / 60;
  var hours = date.getUTCHours();
  newDate.setHours(hours - localOffset);
  return newDate;
}

// Scroll to top off page
function scrollPageTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  var elmnt = document.getElementById("page-scroll-top");
  elmnt.scrollIntoView();
}

// Check if file exits
function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
  if (xhr.status == "404") {
    return false;
  } else {
    return true;
  }
}

// STATS page data
function loadStatsData() {
  return $.ajax(API + "pools")
    .done(function(data) {
      $.each(data.pools, function(index, value) {
        if (currentPool === value.id) {
			
		  $("#blockchainHeight").text(value.networkStats.blockHeight);
		  $("#connectedPeers").text(value.networkStats.connectedPeers);
		  $("#minimumPayment").text(value.paymentProcessing.minimumPayment + " " + value.coin.type);
		  $("#payoutScheme").text(value.paymentProcessing.payoutScheme);
		  $("#poolFeePercent").text(value.poolFeePercent + " %");
		  
          $("#poolHashRate").text(_formatter(value.poolStats.poolHashrate, 5, "H/s"));
		  $("#poolMiners").text(value.poolStats.connectedMiners + " Miner(s)");
          
          $("#networkHashRate").text(_formatter(value.networkStats.networkHashrate, 5, "H/s"));
          $("#networkDifficulty").text(_formatter(value.networkStats.networkDifficulty, 5, ""));
        }
      });
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadStatsData)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


// STATS page charts
function loadStatsChart() {
  return $.ajax(API + "pools/" + currentPool + "/performance")
    .done(function(data) {
      labels = [];
	  
	  poolHashRate = [];
      networkHashRate = [];
      networkDifficulty = [];
      connectedMiners = [];
      connectedWorkers = [];
      
      $.each(data.stats, function(index, value) {
        if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created),false);
          labels.push(createDate.getHours() + ":00");
        } else {
          labels.push("");
        }
		poolHashRate.push(value.poolHashrate);
        networkHashRate.push(value.networkHashrate);
		networkDifficulty.push(value.networkDifficulty);
        connectedMiners.push(value.connectedMiners);
        connectedWorkers.push(value.connectedWorkers);
      });
	  
      var dataPoolHash          = {labels: labels,series: [poolHashRate]};
      var dataNetworkHash       = {labels: labels,series: [networkHashRate]};
      var dataNetworkDifficulty = {labels: labels,series: [networkDifficulty]};
      var dataMiners            = {labels: labels,series: [connectedMiners,connectedWorkers]};
	  
	  var options = {
		height: "200px",
        showArea: false,
        seriesBarDistance: 1,
        // low:Math.min.apply(null,networkHashRate)/1.1,
        axisX: {
          showGrid: false
        },
        axisY: {
          offset: 47,
          scale: "logcc",
          labelInterpolationFnc: function(value) {
            return _formatter(value, 1, "");
          }
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2
        })
      };
	  
      var responsiveOptions = [
        [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[1];
              }
            }
          }
        ]
      ];
      Chartist.Line("#chartStatsHashRate", dataNetworkHash, options, responsiveOptions);
      Chartist.Line("#chartStatsHashRatePool",dataPoolHash,options,responsiveOptions);
      Chartist.Line("#chartStatsDiff", dataNetworkDifficulty, options, responsiveOptions);
      Chartist.Line("#chartStatsMiners", dataMiners, options, responsiveOptions);
 
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadStatsChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}



// Seconds to Days/hours/minutes/seconds
function formatTime(timeInSeconds) {
  var days = Math.floor(timeInSeconds / (3600 * 24));
  timeInSeconds = timeInSeconds % (3600 * 24);
  var hours = Math.floor(timeInSeconds / 3600);
  timeInSeconds = timeInSeconds % 3600;
  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = Math.floor(timeInSeconds % 60);
  var result = "";
  if (days > 0) {
    result += days + "d ";
  }
  if (hours > 0 || result.length > 0) {
    result += hours + "h ";
  }
  if (minutes > 0 || result.length > 0) {
    result += minutes + "m ";
  }
  result += seconds + "s";
  return result;
}

// Milliseconds to Days/hours/minutes/seconds
function formatMilliseconds(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000) % 60;
  let minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  let hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  let days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  let result = "";
  if (days > 0) result += days + "d ";
  if (hours > 0) result += hours + "h ";
  if (minutes > 0) result += minutes + "m ";
  result += seconds + "s";
  return result;
}

// Dashboard page last payment data
function loadUserBalanceData(walletAddress) {
  console.log('Loading user balance data...');
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/payments")
    .done(function (data) {
      if (data[0].created) var datetime = data[0].created;
      var date = datetime.split("T")[0];
      var time = datetime.split("T")[1].split(".")[0];
      var currentTime = new Date();
      var createdTime = new Date(datetime);
      var timeDifference = currentTime - createdTime;
      $("#lastPayment").html(formatMilliseconds(timeDifference) + " ago" + "<br>" + "Amount: " + _formatter(data[0].amount, 5, ""));
    })
    .fail(function () {
      $.notify({
        message: "Error: No response from API.<br>(UserBalanceData)"
      },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Worker TTF Blocks
async function loadWorkerTTFBlocks(walletAddress) {
  console.log("Loading worker TTF Blocks");
  try {
    const response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
    var workerHashRate = 0;
    var workerSharesPerSecond = 0;
    var pendingShares = response.pendingShares
    if (response.performance) {
      $.each(response.performance.workers, function (index, value) {
        workerHashRate += value.hashrate;
        workerSharesPerSecond += value.sharesPerSecond
      });
      // console.log("Worker Shares Per Second: " + workerSharesPerSecond);

      const minersResponse = await $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=50");
      const sharesPerSecond = minersResponse.map(miner => miner.sharesPerSecond);
      var totalPoolSharesPerSecond = sharesPerSecond.reduce((sum, value) => sum + value, 0);
      var minersShareRatio = workerSharesPerSecond / totalPoolSharesPerSecond;
      // console.log("Miners Share Ratio: " + minersShareRatio);
      // console.log("Total Pool Shares Per Second: " + totalPoolSharesPerSecond);
      // console.log("Miners Shares Per Second: " + workerSharesPerSecond);

      const poolsResponse = await $.ajax(API + "pools");
      var blockHeights = [];
      var blockTimes = [];
      $.each(poolsResponse.pools, async function (index, value) {
        if (currentPool === value.id) {
          var networkHashRate = value.networkStats.networkHashrate;
          var poolHashRate = value.poolStats.poolHashrate;
          var poolFeePercentage = value.poolFeePercent;
          var currentBlockheight = value.networkStats.blockHeight;
          var currentBlockheightTime = value.networkStats.lastNetworkBlockTime;
          blockHeights.push(currentBlockheight);
          blockTimes.push(currentBlockheightTime);
          if (blockHeights.length > 1000) {
            blockHeights.shift();
            blockTimes.shift();
          }
          var totalTime = 0;
          for (var i = 1; i < blockHeights.length; i++) {
            var timeDifference = blockTimes[i] - blockTimes[i - 1];
            totalTime += timeDifference;
          }
          var averageTime = totalTime / (blockHeights.length - 1);
          // console.log("Average block time: " + averageTime + " ms");
          const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=100");
          let pendingCount = 0;
          for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "pending") {
              pendingCount++;
            }
          }
          let confirmedCount = 0;
          for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "confirmed") {
              confirmedCount++;
            }
          }
          // console.log("Total Pending Blocks:", pendingCount);

          let reward;
          for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "confirmed") {
              reward = currentBlock.reward;
              break;
            }
          }
          if (blocksResponse.length > 0) {
            var ancientBlock = blocksResponse[blocksResponse.length - 1];
          }
          var recentBlock = blocksResponse[0];
          var MostRecentBlockTime = recentBlock.created;
          var MostRecentBlockHeight = recentBlock.blockHeight;
          var MostAncientBlockTime = ancientBlock.created;
          var MostAncientBlockHeight = ancientBlock.blockHeight;
          var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
          var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
          var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
          var ttf_blocks = (networkHashRate / workerHashRate) * blockTime;
          var totalCoinsPending = (pendingCount * reward)
          var workersPoolSharePercent = (workerHashRate / poolHashRate);
          var workersNetSharePercent = (workerHashRate / networkHashRate);
          var poolFeePercentage = (poolFeePercentage / 100);
          var immatureWorkerBalance = ((totalCoinsPending * poolFeePercentage) * minersShareRatio) * 100;
          var immatureWorkerBalance2 = ((totalCoinsPending * poolFeePercentage) * workersPoolSharePercent) * 100;
          // console.log("immatureWorkerBalanceShares: " + immatureWorkerBalance);
          // console.log("immatureWorkerBalanceHashrate: " + immatureWorkerBalance2);
          // console.log("Pools Total Coins Pending: " + totalCoinsPending);

          const blocks2Response = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=10000");
          var blocksConfirmedByMiner = 0;
          for (let i = 0; i < blocks2Response.length; i++) {
            const currentBlock = blocks2Response[i];
            if (currentBlock.miner === walletAddress && currentBlock.status === "confirmed") {
              blocksConfirmedByMiner++;
            }
          }
          var blocksPendingByMiner = 0;
          for (let i = 0; i < blocks2Response.length; i++) {
            const currentBlock = blocks2Response[i];
            if (currentBlock.miner === walletAddress && currentBlock.status === "pending") {
              blocksPendingByMiner++;
            }
          }
          var blocksPer24Hrs = (86400 / ttf_blocks);
          var MinersCoin = (reward) * (86400 / blockTime) * (workerHashRate / networkHashRate);
          $("#MinersCoins").html("Coins: " + MinersCoin.toLocaleString() + "<br>" + "Blocks: " + blocksPer24Hrs.toFixed(2));
          $("#MinersShare").html("Pool Share: " + _formatter((workersPoolSharePercent) * 100, 2, "%") + "<br>" + "Net. Share: " + _formatter((workersNetSharePercent) * 100, 2, "%"));
          $("#BlocksByMiner").html("Pending: " + blocksPendingByMiner + "<br>" + "Confirmed: " + blocksConfirmedByMiner);
          $("#TTF_Blocks").text(formatTime(ttf_blocks));
          $("#Blocktime").html("Net. Blocktime: " + blockTime.toFixed(2) + " secs" + "<br>" + "Miner TTF: " + formatTime(ttf_blocks));
          $("#pendingBalance").html(("Shares: " + _formatter(pendingShares, 3, "") + "<br>" + "Coins: " + _formatter(immatureWorkerBalance2, 3, "")));
          $("#ConfirmedBlocks").text(confirmedCount.toLocaleString());

          const response = await fetch("../../poolbots/miningcorestats/" + currentPool + ".json");
          const coinlistStats = await response.json();
          var usdProfit = (MinersCoin * coinlistStats.Price);
          // console.log("Coin Price: " + coinlistStats.Price);
          // console.log("Total Profit: $" + usdProfit);
          $("#usdProfit").html("$" + (usdProfit.toFixed(3)));
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// DASHBOARD page data
function loadDashboardData(walletAddress) {
  console.log('Loading dashboard data...');
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
    .done(function (data) {
      $("#pendingShares").text(_formatter(data.pendingShares, 0, ""));
      var workerHashRate = 0;
      var bestWorker = null;
      if (data.performance) {
        $.each(data.performance.workers, function (index, value) {
          workerHashRate += value.hashrate;
          if (!bestWorker || value.hashrate > bestWorker.hashrate) {
            bestWorker = { name: index, hashrate: value.hashrate };
          }
        });
      }
      if (currentPool === "btgpool" || currentPool === "btgpool2" || currentPool === "zen1" || currentPool === "zensolo" || currentPool === "zcl1") {
        $("#minerHashRate").text(_formatter(workerHashRate, 2, "Sol/s"));
      } else {
        $("#minerHashRate").text(_formatter(workerHashRate, 2, "H/s"));
      }
      $("#pendingBalance2").text(_formatter(data.pendingBalance, 5, ""));
      $("#paidBalance").html("Paid Past 24hrs: " + _formatter(data.todayPaid, 5, "") + "<br>" + "Lifetime Paid: " + _formatter(data.pendingBalance + data.totalPaid, 5, ""));
      $("#lifetimeBalance").text(_formatter(data.pendingBalance + data.totalPaid, 5, ""));
      if (bestWorker && bestWorker.name) {
        if (currentPool === "btgpool" || currentPool === "btgpool2" || currentPool === "zen1" || currentPool === "zensolo" || currentPool === "zcl1") {
          $("#BestminerHashRate").text(bestWorker.name + ": " + _formatter(bestWorker.hashrate, 2, "Sol/s"));
        } else {
          $("#BestminerHashRate").text(bestWorker.name + ": " + _formatter(bestWorker.hashrate, 2, "H/s"));
        }
      } else {
        $("#BestminerHashRate").text("N/A");
      }
      if (data.totalPaid === 0) {
        data.lastPaymentLink = "";
      }
      else {
        $("#lastPaymentLink").html("Explorer: <a href='" + data.lastPaymentLink + "' target='_blank'>" + "Click Here" + "</a>");
      }
      loadHomePage();
      loadStatsData(); {
        return $.ajax(API + "pools")
          .done(function (data) {
            $.each(data.pools, function (index, value) {
              if (currentPool === value.id) {
                $("#minPayment").html(value.paymentProcessing.minimumPayment.toLocaleString() + " " + "(" + value.coin.type + ")" + "<br>" + "(" + value.paymentProcessing.payoutScheme + ")");
              }
            });
          });
      }
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardData)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// DASHBOARD page Miner table
async function loadDashboardWorkerList(walletAddress) {
  try {
    const poolsResponse = await $.ajax(API + "pools");
    var poolHashRate = 0;
    var workerHashRate = 0;
    var networkHashRate = 0;
    $.each(poolsResponse.pools, async function (index, value) {
      if (currentPool === value.id) {
        poolHashRate = value.poolStats.poolHashrate;
        networkHashRate = value.networkStats.networkHashrate;
      }
    });
    const response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
    var workerList = "";
    if (response.performance) {
      var workerCount = 0;
      var totalHashRate = 0;
      var totalSharesPerSecond = 0;
      var workerPoolShare = 0;
      var totalPoolSharesPerSecond = 0;
      var workerNetworkShare = 0;
      var totalNetworkSharesPerSecond = 0;

      $.each(response.performance.workers, async function (index, value) {
        workerHashRate = value.hashrate;
        workerCount++;
        totalHashRate += workerHashRate;
        totalSharesPerSecond += value.sharesPerSecond;
        workerPoolShare = (workerHashRate / poolHashRate) * 100
        totalPoolSharesPerSecond += workerPoolShare;
        workerNetworkShare = (workerHashRate / networkHashRate) * 100
        totalNetworkSharesPerSecond += workerNetworkShare;
        workerList += "<tr>";
        workerList += "<td>" + workerCount + "</td>";
        if (index.length === 0) {
          workerList += "<td>Unnamed</td>";
        } else {
          workerList += "<td>" + index + "</td>";
        }
        if (currentPool === "btgpool" || currentPool === "btgpool2" || currentPool === "zen1" || currentPool === "zensolo" || currentPool === "zcl1") {
          workerList += "<td>" + _formatter(value.hashrate, 2, "Sol/s") + "</td>";
        } else {
          workerList += "<td>" + _formatter(value.hashrate, 2, "H/s") + "</td>";
        }
        workerList +=
          "<td>" + _formatter(value.sharesPerSecond, 2, "S/s") + "</td>";
        workerList +=
          "<td>" + _formatter(workerPoolShare, 2, "%") + "</td>";
        workerList +=
          "<td>" + _formatter(workerNetworkShare, 2, "%") + "</td>";
        workerList += "</tr>";
      });
      // add the totals line
      // workerList += "<tr>";
      // workerList += "<td colspan='2'><b>Totals:</b></td>";
      // workerList += "<td><b>" + _formatter(totalHashRate, 2, "H/s") + "</b></td>";
      // workerList += "<td><b>" + _formatter(totalSharesPerSecond, 2, "S/s") + "</b></td>";
      // workerList += "<td><b>" + _formatter(totalPoolSharesPerSecond, 2, "%") + "</b></td>";
      // workerList += "<td><b>" + _formatter(totalNetworkSharesPerSecond, 2, "%") + "</b></td>";
      // workerList += "<td colspan='2'></td>";
      // workerList += "</tr>";
    } else {
      workerList += '<tr><td colspan="5">None</td></tr>';
    }
    $("#workerCount").text(workerCount);
    $("#workerList").html(workerList);
  } catch (error) {
    $.notify(
      {
        message: "Error: No response from API.<br>(loadDashboardWorkerList)"
      },
      {
        type: "danger",
        timer: 3000
      }
    );
  }
}


// DASHBOARD page chart
function loadDashboardChart(walletAddress) {
  console.log('Loading dashboard chart...');
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/performance")
    .done(function (data) {
      labels = [];
      minerHashRate = [];
      $.each(data, function (index, value) {
        if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
          var createDate = convertLocalDateToUTCDate(
            new Date(value.created),
            false
          );
          labels.push(createDate.getHours() + ":00");
        } else {
          labels.push("");
        }
        var workerHashRate = 0;
        $.each(value.workers, function (index2, value2) { workerHashRate += value2.hashrate; });
        minerHashRate.push(workerHashRate);
      });
      var data = { labels: labels, series: [minerHashRate] };
      var options = {
        height: "200px",
        showArea: true,
        seriesBarDistance: 1,
        axisX: {
          showGrid: false
        },
        axisY: {
          offset: 47,
          labelInterpolationFnc: function (value) {
            return _formatter(value, 1, "");
          }
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2
        })
      };
      var responsiveOptions = [
        [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }
        ]
      ];
      Chartist.Line("#chartDashboardHashRate", data, options, responsiveOptions);
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Generate Coin based sidebar
function loadNavigation() {
  console.log("loading navigation panel...");
  return $.ajax(API + "pools")
    .done(function (data) {
      var coinLogo = "";
      var coinName = "";
      var poolList = "<ul class='navbar-nav '>";
      $.each(data.pools, function (index, value) {
        poolList += "<li class='nav-item'>";
        poolList += "  <a href='#" + value.id.toLowerCase() + "' class='nav-link coin-header" + (currentPool == value.id.toLowerCase() ? " coin-header-active" : "") + "'>"
        poolList += "  <img  src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' /> " + value.coin.type;
        poolList += "  </a>";
        poolList += "</li>";
        if (currentPool === value.id) {
          coinLogo = "<img style='width:40px' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
          coinName = value.coin.name;
          if (typeof coinName === "undefined" || coinName === null) {
            coinName = value.coin.type;
          }
        }
      });
      poolList += "</ul>";
      if (poolList.length > 0) {
        $(".coin-list-header").html(poolList);
      }
      var sidebarList = "";
      const sidebarTemplate = $(".sidebar-template").html();
      sidebarList += sidebarTemplate
        .replace(/{{ coinId }}/g, currentPool)
        .replace(/{{ coinLogo }}/g, coinLogo)
        .replace(/{{ coinName }}/g, coinName)
      $(".sidebar-wrapper").html(sidebarList);
      $("a.link").each(function () {
        if (localStorage[currentPool + "-walletAddress"] && this.href.indexOf("/dashboard") > 0) {
          this.href = "#" + currentPool + "/dashboard?address=" + localStorage[currentPool + "-walletAddress"];
        }
      });
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadNavigation)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}
