import pandas as pd
import nltk
from nltk.corpus import stopwords
# from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer
from gensim.utils import simple_preprocess
from collections import Counter
import re
import string
from datetime import datetime, timedelta

def getSlice(delta_min = 60, event_start = '2020-04-06 00:33:00'):
    event_first = '2020-04-06 00:00:00'
    event_end =  '2020-04-10 12:00:00'
    timeslice = [{'start': event_first, 'end': event_start}]
    start = datetime.strptime(event_start, '%Y-%m-%d %H:%M:%S')
    end = datetime.strptime(event_end, '%Y-%m-%d %H:%M:%S')
    nextslice = start + timedelta(minutes=delta_min)
    while(nextslice<end):
        nowstart = datetime.strftime(start, '%Y-%m-%d %H:%M:%S')
        nowend = datetime.strftime(nextslice, '%Y-%m-%d %H:%M:%S')
        timeslice.append({'start': nowstart, 'end': nowend})
        start = nextslice
        nextslice += timedelta(minutes=delta_min)
    return timeslice

def getStat(corpus, locations, aggr):
    # print('getStat with size', corpus['message'].size)
    time_info = getSlice(aggr)
    result = []
    for loc in locations:
        tmp = corpus[corpus['location']==loc]
        counts = [len(tmp[(tmp['time']>=t['start']) & (tmp['time']<t['end'])].index) for t in time_info]
        result.append({'location': loc, 'count': counts})
    return result

def getWord(corpus):
    msglist = corpus['message'].tolist()
    doc = ''
    for text in msglist:
        doc += str(text).lower()
    doc = doc.translate(str.maketrans('', '', string.punctuation))
    doc = simple_preprocess(str(doc))
    # document = ' '.join(word for word in doc)
    stopWords = set(stopwords.words('english'))
    common = ['well', 'want', 'also', 'could', 'even', 'really', 'anyone', 'someone', 'anything', 'something', 'stay', 'get', 'one', 'people', 'go', 'got', 'make', 'us', 'nice', 'still', 'right']
    for w in common:
        stopWords.add(w)
    filtered = [w for w in doc if not w in stopWords]
    print(filtered)
    count = Counter(filtered).most_common(300)
    print(count)
    result = [{'word': x[0], 'count': x[1]} for x in count]
    return result
