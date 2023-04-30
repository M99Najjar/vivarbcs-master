ALTER TABLE lectures ADD COLUMN lecture_type varchar;
UPDATE lectures SET lecture_type = 'lecture' WHERE TRUE;
ALTER TABLE lectures ALTER COLUMN lecture_type SET NOT NULL;