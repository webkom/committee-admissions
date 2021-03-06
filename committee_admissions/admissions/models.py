from django.contrib.auth.models import Group, User
from django.db import models
from django.db.models import Q
from django.utils import timezone

from committee_admissions.admissions import constants
from committee_admissions.utils.models import TimeStampModel


class LegoUser(User):
    class Meta:
        proxy = True

    @property
    def is_privileged(self):
        """
        Return true if the user has admission privileges
        """
        return bool(self.is_superuser or self.admission_privileges)

    @property
    def admission_privileges(self):
        """
        Return true if the user has the role of LEADER or RECRUTING
        """
        return (
            Membership.objects.filter(user=self)
            .filter(Q(role=constants.LEADER) | Q(role=constants.RECRUITING))
            .exists()
        )

    @property
    def leader_of_committee(self):
        """
        Return the name of the committee this user is the leader for
        """
        membership = (
            Membership.objects.filter(user=self)
            .filter(Q(role=constants.LEADER) | Q(role=constants.RECRUITING))
            .first()
        )
        if not membership:
            return None
        return membership.committee

    @property
    def has_application(self):
        """
        Return true if this user has a registrered application
        """
        return UserApplication.objects.filter(user=self).exists()


class Admission(models.Model):
    title = models.CharField(max_length=255)
    open_from = models.DateTimeField()
    public_deadline = models.DateTimeField()
    application_deadline = models.DateTimeField()

    def __str__(self):
        return self.title

    @property
    def is_open(self):
        return self.application_deadline > timezone.now() > self.open_from

    @property
    def is_closed(self):
        return timezone.now() > self.application_deadline

    @property
    def is_appliable(self):
        return self.public_deadline > timezone.now() > self.open_from


class Committee(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, max_length=300)
    response_label = models.TextField(blank=True, max_length=300)
    logo = models.FileField(blank=True, upload_to="committee-logos")
    detail_link = models.CharField(max_length=150, default="")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class UserApplication(TimeStampModel):
    admission = models.ForeignKey(
        Admission, related_name="applications", on_delete=models.CASCADE
    )
    user = models.ForeignKey(LegoUser, on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20)

    class Meta:
        unique_together = ("admission", "user")

    @property
    def is_editable(self):
        return not self.admission.is_closed

    @property
    def is_sendable(self):
        return self.is_editable and self.committee_applications.exists()

    @property
    def applied_within_deadline(self):
        return self.created_at < self.admission.public_deadline

    @property
    def sent(self):
        return bool(self.created_at)

    def has_committee_application(self, committee):
        return self.committee_applications.filter(committee=committee).exists()


class CommitteeApplication(TimeStampModel):
    application = models.ForeignKey(
        UserApplication, related_name="committee_applications", on_delete=models.CASCADE
    )
    committee = models.ForeignKey(
        Committee, related_name="applications", on_delete=models.CASCADE
    )
    text = models.TextField(blank=True)


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    committee = models.ForeignKey(Committee, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=30, choices=constants.ROLES, default=constants.MEMBER
    )

    class Meta:
        unique_together = ("user", "committee")

    def __str__(self):
        return f"{self.user} is in {self.committee}"
