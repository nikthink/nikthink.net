---
date: '2026-03-07T19:00:00-05:00'
draft: false
title: 'How to modify dns records in namecheap'
tags:
    - howto
---
A how-to guide to send to my friends when i want them to modify dns records in namecheap.

<!--more-->

here are the instructions for how to set the dns records for the email server.

1. login to namecheap.

![namecheap ui screenshot 1](namecheap-modify-records-howto/namecheap-screenshot_p1.png "screenshot 1 showing namecheap ui")


2. go to "Domain List". then find the appropriate domain in the list.
   then click on the "MANAGE" button on the same row for that domain.

![namecheap ui screenshot 2](namecheap-modify-records-howto/namecheap-screenshot_p2.png "screenshot 2 showing namecheap ui")

3. click on "Avanced DNS". click on "SHOW MORE" if you see it.

![namecheap ui screenshot 3](namecheap-modify-records-howto/namecheap-screenshot_p3.png "screenshot 3 showing namecheap ui")

4. every row in that table is a dns record. the rightmost column contains
   a thrash icon that you can use to delete a record. deleting a record and
   then adding it back is the equivalent of editing it.
   to add a new record, click on "ADD NEW RECORD". a new empty row/record will
   be shown in the ui. You want to set the
   "type", "name" (namecheap calls it "hosts"), and "value" fields as
   i tell you.

if a record already exists for the same "name" and "type", usually it means
i want to you delete it and then create a new one with the values i provide
you. but you may want to warn me that it already existed and give me the old
value just in case.

records with name "@" is the equivlent of setting records for the domain "example.com";  
records with name "ftp" is the equivalent of seeting records for the domain "ftp.example.com", etc.
