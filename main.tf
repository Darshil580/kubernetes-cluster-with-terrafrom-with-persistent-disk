

provider "google" {
    project = "csci-5409-advanced-cloud"
    region  = "us-central1"
    zone    = "us-central1-a"
    # version = "3.68.0"
}


# Create the Persistent Disk for Persistent Volume
# resource "google_compute_disk" "my_persistent_volume" {
#     name  = "darshil-pv-storage"
#     size  = 1
#     type  = "pd-standard"
#     zone  = "us-central1-a"
# }



resource "google_container_cluster" "primary" {

    name               = "darshil-gke-cluster"
    location           = "us-central1"
    # remove_default_node_pool = true
    initial_node_count = 1
    node_locations     = ["us-central1-a"]
    # min_master_version = "1.20.0"

    node_config {

        image_type   = "COS_CONTAINERD"
        # machine_type = "e2-medium"
        disk_type    = "pd-standard"
        # disk_size_gb = 10

        # Add Persistent Volume for root path
        kubelet_config {

            cpu_manager_policy = "none"
        }
    }

    network    = "default"
    subnetwork = "default"
}



# Output the cluster name
# output "cluster_name" {
    # value = google_container_cluster.primary.name
# }

