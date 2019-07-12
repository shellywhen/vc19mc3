# -*- coding: UTF-8 -*-
import pandas as pd
from dataHandler.stat import getStat, getWord
class DataService(object):
    def __init__(self):
        self.data = pd.read_csv('data/newdata.csv')
        # self.data['time'] = pd.to_datetime(self.data['time'],format='%Y-%m-%d %H:%M:%S')
        self.data = self.data[self.data['valid']]
        self.detail = pd.DataFrame()

    def getKeyWord(self, keyword):
        if keyword == "":
             return []
        corpus = self.data.copy()
        corpus = corpus[corpus.apply(lambda x: keyword.lower() in str(x['message']).lower(), axis=1)]
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
        if filter == True:
            corpus = self.data[self.data.apply(lambda x: str(x['message'])[0:4]!='re: ', axis=1)].copy()
        else:
            corpus = self.data.copy()
        corpus = corpus[corpus['location'].isin(loc)]
        if overview == True:
            self.detail = corpus
            return {'data': corpus.to_dict('records'), 'stat': getStat(corpus, loc, aggr)}
        corpus = corpus[corpus.apply(lambda x: judge(x['message'], topic), axis=1)]
        self.detail = corpus
        data = corpus.to_dict('records')
        stat = getStat(corpus, loc, aggr)
        result = {
            'data': data,
            'stat': stat
        }
        print('ok')
        return result

    def getCount(self, period):
        start = period[0][0:10] + ' ' + period[0][11:19]
        end = period[1][0:10] + ' ' + period[1][11:19]
        corpus = self.detail[(self.detail['time']>=start)&(self.detail['time']<=end)]
        return getWord(corpus)


def judge (text, topicList):
    post = str(text).lower()
    for keyword in topicList:
        if keyword.lower() in post:
            return True
    return False

dataHandler = DataService()

if __name__ == '__main__':
    dataService = DataService()
