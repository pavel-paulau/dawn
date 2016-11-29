package main

import (
	"gopkg.in/couchbase/gocb.v1"
)

type dataSource struct {
	bucket *gocb.Bucket
}

const (
	connSpecStr     = "couchbase://perflab.sc.couchbase.com"
	couchbaseBucket = "perf_daily"
)

func newDataSource() *dataSource {
	cluster, err := gocb.Connect(connSpecStr)
	if err != nil {
		panic(err)
	}

	bucket, err := cluster.OpenBucket(couchbaseBucket, "")
	if err != nil {
		panic(err)
	}

	return &dataSource{bucket}
}

type description struct {
	Description string `json:"description"`
}

func (d *dataSource) getDescriptions() ([]description, error) {
	var descriptions []description

	query := gocb.NewN1qlQuery(
		"SELECT DISTINCT(m.description) " +
			"FROM perf_daily b " +
			"UNNEST b.metrics AS m " +
			"WHERE m.description IS NOT NULL;")

	rows, err := d.bucket.ExecuteN1qlQuery(query, []interface{}{})
	if err != nil {
		return descriptions, err
	}

	var row description
	for rows.Next(&row) {
		descriptions = append(descriptions, row)
	}
	return descriptions, nil
}

type result struct {
	Build string  `json:"build"`
	Value float64 `json:"value"`
}

func (d *dataSource) getResults(description string) ([]result, error) {
	var results []result

	query := gocb.NewN1qlQuery(
		"SELECT b.`build`, m.`value` " +
			"FROM perf_daily b " +
			"UNNEST b.metrics AS m " +
			"WHERE m.description = $1 " +
			"ORDER BY b.`build`;")
	params := []interface{}{description}

	rows, err := d.bucket.ExecuteN1qlQuery(query, params)
	if err != nil {
		return results, err
	}

	var row result
	for rows.Next(&row) {
		results = append(results, row)
	}
	return results, nil
}
