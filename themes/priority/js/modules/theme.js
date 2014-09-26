/*
 * 
 *  Blockstrap v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECTS
    var theme = {};
    theme.filters = {};
    theme.buttons = {};
    theme.missing = [];
    theme.issues = [];
    
    // CALCULATE POINTS
    theme.formulas = {
        tx: 1,
        coin: 10
    };
    
    // NEW DOM CONTENT
    theme.new = function()
    {
        // QR CODES
        $('#issues .qr-code').each(function(i)
        {
            if($(this).find('img').length < 1)
            {
                $(this).qrcode({
                    render: 'image',
                    width: 80,
                    height: 80,
                    text: $(this).attr('data-content')
                });
            }
        });
        // ISOTOPE FILTERING
        var $container = $('#issues').isotope({
            itemSelector: '.issue',
            layoutMode: 'vertical',
            vertical: {
                gutterWidth: 0
            },
            getSortData: {
                addresses: '[data-addresses]',
                titles: '[data-titles]',
                votes: '[data-votes] parseFloat',
                contributions: '[data-contributions] parseFloat',
                points: '[data-points] parseFloat'
            },
            sortBy: 'points',
            sortAscending: false
        });
        $('#filters').on('click', 'a', function(e)
        {
            e.preventDefault();
            $('#filters a').removeClass('active');
            $(this).addClass('active');
            var sort = $(this).attr('data-sort');
            var order = false;
            if(sort == 'titles' || sort == 'addresses') order = true;
            $container.isotope({ sortBy: sort, sortAscending: order});
        });
        $('select#filter').on('change', function()
        {
            $('#filters a#' + $(this).val()).trigger('click');
        });
        $($.fn.blockstrap.element).on('submit', '#setup-device', function(e)
        {
            e.preventDefault();
        });
        $($.fn.blockstrap.element).on('submit', '#quick-send', function(e)
        {
            e.preventDefault();
            var id = $(this).find('#id').val();
            var to = $(this).find('#to').val();
            var salt = localStorage.getItem('nw_blockstrap_salt');
            if(blockstrap_functions.json(salt)) salt = $.parseJSON(salt);
            var security = $.fn.blockstrap.settings.security;
            var obj = CryptoJS.SHA3(salt, { outputLength: 512 });
            var hash = obj.toString().substring(0, 32);
            if(security && hash == security)
            {
                if(!$.fn.blockstrap.btc.validate(to))
                {
                    var content = '<p>Not a valid address, please try another.</p>';
                    $.fn.blockstrap.core.modal('Warning', content);   
                }
                else
                {   
                    var amount = 0;
                    var keys = $.fn.blockstrap.btc.keys(salt + id);
                    var from = keys.pubkey.toString();
                    
                    if($.isArray(theme.issues))
                    {
                        if(blockstrap_functions.array_length(theme.issues) > 0)
                        {
                            $.each(theme.issues, function(k, issue)
                            {
                                if(issue.address == from)
                                {
                                    var obj = localStorage.getItem('nw_issue_' + from);
                                    if(blockstrap_functions.json(obj))
                                    {
                                        obj = $.parseJSON(obj);
                                    }
                                    amount = obj.balance - ($.fn.blockstrap.settings.currencies.btc.fee * 100000000);
                                }
                            });
                        }
                    }
                    
                    $.fn.blockstrap.btc.send(to, amount, from, keys, function(tx)
                    {
                        if($.isPlainObject(tx))
                        {
                            theme.issues = [];
                            var content = 'The funds have been transferred to ' + to;
                            $.fn.blockstrap.core.refresh(function()
                            {
                                $.fn.blockstrap.core.modal('Success', content);
                            }, 'index', false);
                        };
                    });
                }
            }
        });
        // CHECK MISSING ADDRESSES
        if($.fn.blockstrap.settings.role == 'admin')
        {
            $('#issues').addClass('admin');
            if(blockstrap_functions.array_length(theme.missing) > 0)
            {
                var content = '<p>The following issues are missing addresses:</p>';
                $.each(theme.missing, function(k, issue)
                {
                    content+= '<p class="left">'+issue.title+': ' + issue.address + '</p>';
                });
                $.fn.blockstrap.core.modal('Warning', content);
            }
        }
        // UPDATE BALANCES
        if(blockstrap_functions.array_length(theme.issues) > 0)
        {
            setInterval(function()
            {
                var txs = [];
                var count = 0;
                var balance = 0;
                var addresses = [];
                var bs = $.fn.blockstrap;
                var $bs = blockstrap_functions;
                var content = '<p>The following contributions have been made:</p>';
                var para = function(tx, address)
                {
                    var this_content = '';
                    var value = tx.value;
                    var val = '' + parseInt(tx.value) / 100000000;
                    var currency = bs.settings.currencies[tx.currency].currency;
                    var amount = '<strong>' + val + '</strong> ' + currency;
                    
                    if($bs.array_length(theme.issues) > 0)
                    {
                        $.each(theme.issues, function(k, issue)
                        {
                            if(issue.address == address)
                            {
                                address = issue.title;
                            }
                        });
                    }
                    
                    var context = amount + ' <strong>recieved</strong>';
                    if(address) context+= ' for ' + address;
                    
                    var base = bs.settings.base_url;
                    var url = base + '?txid=' + tx.txid + '#transaction';
                    if(value < 0)
                    {
                        context = '<strong>' + val.substring(1) + '</strong> ';
                        context+= currency + ' <strong>sent</strong>';
                    }
                    this_content+= '<p>' + context + ':<br />TXID ';
                    this_content+= '<a href="' + url + '">' + tx.txid + '</a></p>';
                    return this_content;
                }
                $.each(theme.issues, function(k, issue)
                {
                    addresses.push(issue.address);
                });
                var address_count = $bs.array_length(addresses);
                var diffs = {};
                bs.api.addresses(addresses, 'btc', function(results)
                {
                    if($.isArray(results))
                    {
                        $.each(results, function(k, obj)
                        {
                            count++;
                            bs.data.find('issue', obj.address, function(saved_obj)
                            {
                                var tx_count = 0;
                                if($bs.json(saved_obj)) saved_obj = $.parseJSON(saved_obj);
                                if(saved_obj.tx_count) tx_count = saved_obj.tx_count;
                                if(tx_count < obj.tx_count)
                                {
                                    txs.push(obj);
                                    diffs['id_'+obj.address] = obj.tx_count - tx_count;
                                }
                                balance = balance + obj.balance;
                                bs.data.save('issue', obj.address, obj, function()
                                {
                                    bs.data.save('issue', 'balance', balance, function()
                                    {   
                                        if(count >= address_count)
                                        {
                                            if($bs.array_length(txs) > 0)
                                            {
                                                var title = 'Attention';
                                                $.each(txs, function(key, tx)
                                                {
                                                    bs.api.transactions(
                                                        tx.address, 
                                                        'btc',
                                                        function(transactions)
                                                    {
                                                        if($.isArray(transactions))
                                                        {
                                                            var trans = transactions.slice(0, diffs['id_'+tx.address]);
                                                            $.each(
                                                                trans, 
                                                                function(k, tran)
                                                            {
                                                                content+= para(tran, tx.address);
                                                                if(k + 1 >= $bs.array_length(trans) && key + 1 >= $bs.array_length(txs))
                                                                {
                                                                    theme.issues = [];
                                                                    bs.core.refresh(function()
                                                                    {
                                                                        bs.core.modal(title, content);
                                                                    }, 'index', false);
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }, $.fn.blockstrap.settings.cache.accounts);
        }
    }
    
    // THEME FILTERS
    theme.filters.issues = function(blockstrap, data)
    {
        var $bs = blockstrap_functions;
        var salt = localStorage.getItem('nw_blockstrap_salt');
        if($bs.json(salt)) salt = $.parseJSON(salt);
        if($.isArray(priority_issues))
        {
            $.each(priority_issues, function(k, issue)
            {
                var id = $bs.slug(issue.title);
                if(issue.address && issue.address !== '')
                {
                    if(!issue.votes) issue.votes = 0;
                    if(!issue.contributions) issue.contributions = 0;
                    var saved_issue = localStorage.getItem('nw_issue_' + issue.address);
                    if($bs.json(saved_issue)) saved_issue = $.parseJSON(saved_issue);
                    if($.isPlainObject(saved_issue))
                    {
                        if(!saved_issue.balance) saved_issue.balance = 0;
                        if(saved_issue.tx_count)
                        {
                            issue.votes = saved_issue.tx_count;
                            issue.contributions = saved_issue.balance / 100000000;
                        }
                    }
                    var url = $.fn.blockstrap.settings.base_url;
                    var votes = issue.votes * theme.formulas.tx;
                    var contributions = issue.contributions * theme.formulas.coin;
                    var points = votes + contributions;
                    issue.id = id;
                    issue.home = url;
                    issue.href = url + '?id=' + id + '#issue';
                    issue.points = points;
                    if(data.id && data.id == id)
                    {
                        theme.issues = [];
                        if(saved_issue && saved_issue.tx_count && saved_issue.balance > 0)
                        {
                            theme.issues.push(issue);
                        }
                    }
                    else if(!data.id)
                    {
                        if(saved_issue && saved_issue.tx_count && saved_issue.balance > 0)
                        {
                            theme.issues.push(issue);
                        }
                    }
                }
                else if($.fn.blockstrap.settings.role == 'admin')
                {
                    // CREATE ADDRESS
                    var keys = $.fn.blockstrap.btc.keys(salt + id);
                    theme.missing.push({
                        title: issue.title,
                        address: keys.pubkey.toString()
                    });
                }
            });
        }
        return theme.issues;
    }
    theme.filters.issue = function(blockstrap, data)
    {
        var issue = false;
        var id = blockstrap_functions.vars('id');
        data.id = id;
        return theme.filters.issues(false, data);
    }
    theme.filters.balance = function(blockstrap, data)
    {
        var balance = localStorage.getItem('nw_issue_balance');
        if(blockstrap_functions.json(balance)) balance = $.parseJSON(balance);
        if(!balance) balance = 0;
        return '' + balance / 100000000 + ' Bitcoin';
    }
            
    
    // COPIED FROM CORE TO REMOVE NEED FOR CORE FILTERS
    theme.filters.bootstrap = function(blockstrap, data)
    {
        var snippet = blockstrap.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    theme.filters.setup = function(blockstrap, data)
    {
        if(data.step)
        {
            var step = parseInt(data.step) - 1;
            return blockstrap.core.filter(blockstrap_setup_steps[step]);
        }
        else return data;
    }
    
    // THEME BUTTONS
    theme.buttons.qr = function(button, e)
    {
        e.preventDefault();
        var address = $(button).attr('data-content');
        var title = 'Contribute to ' + address;
        var content = '<div class="qr-holder" data-content="' + address + '"></div>';
        $.fn.blockstrap.core.modal(title, content);
    }
    theme.buttons.details = function(button, e)
    {
        e.preventDefault();
        var details = $(button).parent().find('.details').html();
        var title = $(button).parent().parent().parent().find('.info h4 .title').text();
        $.fn.blockstrap.core.modal(title, details);
    }
    theme.buttons.share = function(button, e)
    {
        e.preventDefault();
        var t = $(button).parent().parent().parent().find('.info h4 .title').text();
        var u = $.fn.blockstrap.settings.base_url + '#' + blockstrap_functions.slug(t);
        var twitter = 'https://twitter.com/intent/tweet?url='+u+'&text='+t;
        var facebook = 'http://www.facebook.com/sharer/sharer.php?u='+u+'&t='+t;
        var linked = 'http://www.linkedin.com/shareArticle?mini=true&url='+u+'&title='+t;
        var google = 'https://plus.google.com/share?url='+u;
        $('#share-modal').find('a.twitter').attr('href', twitter);
        $('#share-modal').find('a.facebook').attr('href', facebook);
        $('#share-modal').find('a.linked').attr('href', linked);
        $('#share-modal').find('a.google').attr('href', google);
        $.fn.blockstrap.core.modal(t, false, 'share-modal');
    }
    theme.buttons.close = function(button, e)
    {
        e.preventDefault();
        if($.fn.blockstrap.settings.role == 'admin')
        {
            var id = $(button).attr('data-id');
            var form = '<form id="quick-send"><input type="text" class="form-control" id="to" placeholder="Where to send the balance?" /><input type="hidden" id="id" value="'+id+'" /><br /><button type="submit" class="btn btn-primary pull-right">Send</button></form><p class="clearfix"></p>';
            var content = '<p>You should probably send the balance of this issue to another address before closing and (or) removing the issue. Please use the form below to do so:</p>';
            $.fn.blockstrap.core.modal('Close Issue', content + form);
        }
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {theme:theme});
})
(jQuery);