package db

import (
	"context"
	"github.com/jackc/pgx/v4/pgxpool"
	"log"
	"quiz/internal/http/api"
)

type PackageStorage struct {
	pool *pgxpool.Pool
}

func NewPackageStorage(pool *pgxpool.Pool) *PackageStorage {
	return &PackageStorage{
		pool: pool,
	}
}

func (p *PackageStorage) SelectOne(ctx context.Context, packageID int) *api.FullPack {
	rows, _ := p.pool.Query(ctx, "SELECT id, categoryid, title, data FROM packages WHERE id = $1", packageID)
	fullPackage := &api.FullPack{}
	for rows.Next() {
		err := rows.Scan(&fullPackage.Id, &fullPackage.CategoryId, &fullPackage.Title, &fullPackage.Pack)
		if err != nil {
			log.Fatal(err)
		}
	}

	return fullPackage
}
