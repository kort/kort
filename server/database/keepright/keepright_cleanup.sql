-- delete all records that are not in Switzerland
delete from keepright.errors where schema not in ('95','96');

reindex table keepright.errors;


-- translate description

-- replace text in description
update keepright.errors set msgid = replace(replace(replace(replace(replace(msgid, '$1', txt1), '$2', txt2), '$3', txt3), '$4', txt4), '$5', txt5);
