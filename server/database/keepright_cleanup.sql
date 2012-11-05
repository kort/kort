delete from keepright.errors where schema not in ('95','96');

reindex table keepright.errors;
