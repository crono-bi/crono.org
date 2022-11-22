SELECT
  AddressId,
  AddressItem,
  content
FROM staging.Address
UNPIVOT (content FOR AddressItem IN (AddressLine1,AddressLine2)) unpvt