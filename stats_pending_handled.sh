#/bin/sh

handled=$(ls -l apify_storage/request_queues/default/handled | wc -l)
pending=$(ls -l apify_storage/request_queues/default/pending | wc -l)

echo "Pending Requests: $pending"
echo "Handled Requests: $handled"