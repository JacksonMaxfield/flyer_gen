import os
import json
import requests
from bs4 import BeautifulSoup as bs

from pprint import pprint

dir_path = os.path.dirname(os.path.realpath(__file__))
parent_path = os.path.dirname(dir_path)

# to update the mocs.json uncomment the last script tag in index.html and reload the window.
def run_image_get():
    mocs_data = dict()
    with open(dir_path + '/mocs.json', 'r', encoding='latin') as mocs_file:
        mocs_data = json.load(mocs_file)

    base_wiki_url = 'https://en.wikipedia.org'

    for key, moc in mocs_data.items():
        try:
            save_path = (parent_path +
                        '/resources/')

            saved_images = os.listdir(save_path)
            already_stored = any(
                    [str(moc['govtrack_id']) in img for img in saved_images])

            print('already stored:', moc['govtrack_id'], already_stored)

            if moc['in_office'] and not already_stored:
                try:
                    wiki_id = '/wiki/' + moc['wikipedia_id'].replace(' ', '_')
                    url = base_wiki_url + wiki_id
                    r = requests.get(url)
                    soup = bs(r.content, 'html.parser')
                    try:
                        card = soup.find('table', class_='infobox vcard')
                        img_link = card.find('a', class_='image')['href']
                        img_link = base_wiki_url + img_link

                        r = requests.get(img_link)
                        soup = bs(r.content, 'html.parser')
                        file_div = soup.find('div', class_='fullImageLink')
                        link = file_div.find('a')['href']

                        if 'https:' not in link:
                            link = 'https:' + link

                        r = requests.get(link, stream=True)
                        ending = url[-4:]
                        if '.' not in ending:
                            ending = '.jpg'
                        if '_Jr' in ending:
                            ending = '.jpg'

                        save_path += (moc['govtrack_id'] + ending)
                        with open(save_path, 'wb') as f:
                            for chunk in r.iter_content(chunk_size=1024):
                                if chunk:
                                    f.write(chunk)

                        print('stored image for', moc['govtrack_id'])

                    except AttributeError as e:
                        print('failed to find image for:', moc['govtrack_id'], url.encode('latin'))
                except KeyError as e:
                    print('no wiki url:', moc['govtrack_id'], moc['displayName'].encode('latin'))
        except KeyError as e:
            pass

run_image_get()
