#!/bin/sh
cmd=/Users/lap12361/Project/sites/vinavideo/update_data.sh
mkdir -p data
index="index_p.html"
key=$(awk  -F: '/config_key:/{sub(/^./,"",$2);sub(/.$/,"",$2);print $2}' $index)
_parse(){
	tmp=$(mktemp)
	key="$1"
	echo $key | grep '2PACX' > /dev/null
	if [ $? -eq 0 ];then
		curl -skL "https://docs.google.com/spreadsheets/d/e/$key/pub?output=csv" -o data/${key}.csv
		dos2unix data/${key}.csv
		awk -F ',' '/2PACX/ {v=$NF;sub(/\..*$/,"",v);print v}' data/${key}.csv | while read key1;do
			echo $key1 | grep '2PACX' > /dev/null
			if [ $? -eq 0 ];then
				echo $cmd _parse $key1  >> $tmp
			fi
		done
	fi
	cat $tmp
	bash $tmp
	rm $tmp
}
if [ $# -gt 0 ];then $@;exit 0;fi
_parse $key
