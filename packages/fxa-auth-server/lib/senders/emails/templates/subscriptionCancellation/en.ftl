# Variables
#   $productName (String) - The name of the subscribed product, e.g. Mozilla VPN
subscriptionCancellation-subject = Your { $productName } subscription has been canceled
subscriptionCancellation-title = Sorry to see you go

## Variables
##   $productName (String) - The name of the subscribed product, e.g. Mozilla VPN
##   $invoiceTotal (String) - The amount of the subscription invoice, including currency, e.g. $10.00
##   $invoiceDateOnly (String) - The date of the invoice, e.g. 01/20/2016

subscriptionCancellation-content-2 = We’ve canceled your { $productName } subscription. Your final payment of { $invoiceTotal } was paid on { $invoiceDateOnly }.
subscriptionCancellation-outstanding-content-2 = We’ve canceled your { $productName } subscription. Your final payment of { $invoiceTotal } will be paid on { $invoiceDateOnly }.

# Variables
#   $serviceLastActiveDateOnly (String) - The date of last active service, e.g. 01/20/2016
subscriptionCancellation-content-continue = Your service will continue until the end of your current billing period, which is { $serviceLastActiveDateOnly }.
