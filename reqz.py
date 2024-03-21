import requests

# Define the URL and the API token
url = 'https://ggapi-uat.5k2an3or4q209.xyz/ggapi/register'
api_token = 'V1Emi6WbMBDNhisFv7BymqBBfsSXDfCwGcgIPRRzm2MyWsGainqATAB71VVXDUPs'

# Set up the headers with the Authorization token
headers = {
    'Authorization': f'Bearer {api_token}'
}

# Set up the data (or payload) you want to send
data = {
    'brandcode': 'GAPI',
    'username': 'gapimember100122',
    'password': '123456aa',
    'currencycode': 'THB',
    'ip': '127.0.0.1',
    'bankid': '71',
    'accountname': 'GAPI Member 02 Bank',
    'accountnumber': '324583053821'
}

# Make the POST request
response = requests.post(url, headers=headers, data=data)

# Check for request's success
if response.status_code == 200:
    print("Request successful.")
    # Handle response
    print(response.text)
else:
    print("Request failed.")
    print(response.text)
