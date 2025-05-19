class ProductFilter {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  queryString = {};

  // Search: Bu metod, gelen sorgu parametrelerine göre ürünleri arar. Örneğin, ürün adında belirli bir kelimeyi aramak için kullanılır.
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter: Bu metod, gelen sorgu parametrelerini kullanarak veritabanındaki ürünleri filtreler. Örneğin, fiyat aralığına göre ürünleri filtrelemek için kullanılır.
  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields from the query
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    //Gelen URL: /api/products?keyword=apple&price[gt]=100&price[lt]=500&page=2
  }

  // Pagination: Bu metod, MongoDB sorgularında sayfalama (pagination) yapmak için kullanılır. Sonuçları belirli sayıda gruplayarak sayfa sayfa göstermeye yarar.

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
    
    //  /api/products?page=3
  }
}
// Örnek Kullanım Senaryosu

module.exports = ProductFilter;
