import os
import json
import requests
from bs4 import BeautifulSoup as bs

from pprint import pprint

dir_path = os.path.dirname(os.path.realpath(__file__))
parent_path = os.path.dirname(dir_path)

# to update the

def get_json_mocs():
    with open(dir_path + '/mocs.json', 'r') as mocs_file:
        return json.load(mocs_file)

def get_wiki_image(url):
    r = requests.get(url)
    soup = bs(r.content, 'html.parser')

    card = soup.find('table', class_='infobox vcard')

    try:
        img = card.find('img')

        try:
            return img['src']
        except:
            return img['srcset']

    except:
        img = card.find('a', class_='image')
        return img['href']

    # print(src)

def try_find_image(lost, found, url, name):
    try:
        found_url = get_wiki_image('https://en.wikipedia.org/wiki/' + url)
        if 'https:' not in found_url:
            found_url = 'https:' + found_url

        found[name] = found_url

    except:
        lost.append('https://en.wikipedia.org/wiki/' + url)

    return lost, found

def download_file(url, filename):
    r = requests.get(url, stream=True)

    ending = url[-4:]
    if '.' not in ending:
        ending = '.jpg'

    with open(parent_path + '/resources/' + filename + ending, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    return filename

def download_images(named_urls):
    for key, value in named_urls.items():
        download_file(url=value, filename=key)

def process_mocs_data(mocs_data, overwrite=False):
    lost = list()
    found = dict()

    for key in mocs_data:

        try:
            url = mocs_data[key]['wikipedia_id'].replace(' ', '_')

            lost, found = try_find_image(lost, found, url, mocs_data[key]['displayName'].replace(' ', '_'))

        except Exception as e:
            if str(e) == "'wikipedia_id'":
                try:
                    url = mocs_data[key]['displayName'].replace(' ', '_')

                    lost, found = try_find_image(lost, found, url, mocs_data[key]['displayName'].replace(' ', '_'))

                except Exception as e:
                    print(e)

            else:
                print('no wikipedia_id for:', mocs_data[key]['displayName'].replace(' ', '_'))

    if len(lost) > 0:
        print('unable to get image url from:')
        pprint(lost)

    return found

def run_image_get():

    mocs_data = get_json_mocs()

    found_urls = process_mocs_data(mocs_data)

    download_images(found_urls)

run_image_get()
