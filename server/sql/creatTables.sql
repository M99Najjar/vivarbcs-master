CREATE  TABLE "public".universities ( 
	university_id        serial  NOT NULL  ,
	university_name      varchar(100)    unique,
	CONSTRAINT pk_universities PRIMARY KEY ( university_id ),
	CONSTRAINT universities_university_name_key UNIQUE ( university_name ) 
 );

CREATE  TABLE "public".faculties ( 
	faculty_id           serial  NOT NULL  ,
	faculty_name         varchar(100)  NOT NULL  unique,
	university_id        integer  NOT NULL  ,
	CONSTRAINT pk_faculties PRIMARY KEY ( faculty_id )
 );

CREATE  TABLE "public".subjects ( 
	subject_id           serial  NOT NULL  ,
	subject_name         varchar(100)  NOT NULL  ,
	"year"               integer  NOT NULL  ,
	season               integer  NOT NULL  ,
	faculty_id           integer  NOT NULL  ,
	CONSTRAINT pk_subject PRIMARY KEY ( subject_id )
 );

CREATE  TABLE "public".users ( 
	user_id              serial  NOT NULL  ,
	user_name            varchar(100)  NOT NULL  ,
	user_password        text    ,
	"year"               integer    ,
	faculty_id           integer    ,
	phone_number         integer    ,
	user_role            integer  NOT NULL  ,
	created_at           timestamp DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT pk_users PRIMARY KEY ( user_id )
 );

CREATE  TABLE "public".doctors ( 
	doctor_id            serial  NOT NULL  ,
	doctor_name          varchar(100)  NOT NULL  ,
	subject_id           integer  NOT NULL  ,
	CONSTRAINT pk_doctors PRIMARY KEY ( doctor_id )
 );

CREATE  TABLE "public".lectures ( 
	lecture_id           serial  NOT NULL  ,
	lecture_name         varchar(100)  NOT NULL  ,
	doctor_id            integer  NOT NULL  ,
	uploader_id          integer  NOT NULL  ,
	created_at           timestamp DEFAULT CURRENT_TIMESTAMP   ,
	CONSTRAINT pk_lectures PRIMARY KEY ( lecture_id )
 );

ALTER TABLE "public".doctors ADD CONSTRAINT fk_doctors_subjects FOREIGN KEY ( subject_id ) REFERENCES "public".subjects( subject_id );

ALTER TABLE "public".faculties ADD CONSTRAINT fk_faculties_universities FOREIGN KEY ( university_id ) REFERENCES "public".universities( university_id );

ALTER TABLE "public".lectures ADD CONSTRAINT fk_lectures_users FOREIGN KEY ( uploader_id ) REFERENCES "public".users( user_id );

ALTER TABLE "public".lectures ADD CONSTRAINT fk_lectures_doctors FOREIGN KEY ( doctor_id ) REFERENCES "public".doctors( doctor_id );

ALTER TABLE "public".subjects ADD CONSTRAINT fk_subject_faculties FOREIGN KEY ( faculty_id ) REFERENCES "public".faculties( faculty_id );

ALTER TABLE "public".users ADD CONSTRAINT fk_users_faculties FOREIGN KEY ( faculty_id ) REFERENCES "public".faculties( faculty_id );
