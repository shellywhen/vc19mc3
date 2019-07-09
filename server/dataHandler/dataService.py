# -*- coding: UTF-8 -*-
import pandas as pd
from dataHandler.stat import getStat
class DataService(object):
    def __init__(self):
        self.data = pd.read_csv('data/newdata.csv')
        self.data = self.data[self.data['valid']]
        self.data =  self.data[self.data.apply(lambda x: str(x['message'])[0:4]!='re: ', axis=1)]

    def getKeyWord(self, keyword):
        if keyword == "":
             return []
        corpus = self.data.copy()
        corpus = corpus[corpus.apply(lambda x: keyword.lower() in str(x['message']).lower(), axis=1)]
        # corpus[corpus['message'].notnull()&corpus['message'].str.contains(keyword)].to_dict('records')
        return corpus.to_dict('records')

    def getAll(self):
        return self.data.to_dict('records')

    def getOriginal(self):
        self.data = self.data

    def getData(self, conf):
        loc = conf['location']
        aggr = conf['aggregation']
        filter = conf['filter']
        overview = conf['overview']
        topic = conf['topic']
        if overview == True:
            return {'data': self.getAll(), 'stat': getStat(self.data, loc, aggr)}
        if filter == True:
            corpus = self.data[self.data.apply(lambda x: str(x['message'])[0:4]!='re: ', axis=1)].copy()
        else:
            corpus = self.data.copy()
        corpus = corpus[corpus['location'].isin(loc)]
        corpus = corpus[corpus.apply(lambda x: judge(x['message'], topic), axis=1)]
        data = corpus.to_dict('records')
        stat = getStat(corpus, loc, aggr)
        result = {
            'data': data,
            'stat': stat
        }
        print('return', result['stat'])
        return result

def judge (text, topicList):
    post = str(text).lower()
    for keyword in topicList:
        if keyword.lower() in post:
            return True
    return False

dataHandler = DataService()

if __name__ == '__main__':
    dataService = DataService()
